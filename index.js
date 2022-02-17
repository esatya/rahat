const config = require('config');
const mongoose = require('mongoose');
const Hapi = require('@hapi/hapi');
const inert = require('@hapi/inert');
const path = require('path');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

const ethers = require('ethers');
const Logger = require('./helpers/logger');
const app = require('./app');
const registerFeats = require('./helpers/register-modules');
const ws = require('./helpers/utils/socket');

const logger = Logger.getInstance();
const port = config.get('app.port');
const {listenTokenTx, stopListener} = require('./helpers/blockchain/tokenTxListener');

const network = config.get('blockchain.httpProvider');
const provider = new ethers.providers.JsonRpcProvider(network);

mongoose.connect(config.get('app.db'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const server = new Hapi.Server({
  port,
  router: {
    stripTrailingSlash: true
  },
  routes: {
    cors: {
      origin: config.has('app.cors') ? config.get('app.cors') : ['*'],
      additionalHeaders: [
        'cache-control',
        'x-requested-with',
        'access_token',
        'auth_signature',
        'data_signature'
      ]
    },
    files: {
      relativeTo: path.join(__dirname, 'public/build')
    },
    validate: {
      failAction: async (request, h, err) => {
        if (process.env.NODE_ENV === 'production') {
          // In prod, log a limited error message and throw the default Bad Request error.
          return h
            .response({
              statusCode: 400,
              error: 'Bad Request',
              message: err.message
            })
            .code(400)
            .takeover();
        }
        // During development, log and respond with the full error.
        return err;
      }
    }
  }
});
// connect websocket
ws.create(server.listener);
ws.getClient(1, 'hello');
app.connectServer(server);

const swaggerOptions = {
  info: {
    title: 'Rahat Server',
    version: process.env.npm_package_version,
    description: process.env.npm_package_description
  },
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'access_token',
      in: 'header'
    }
  },
  security: [{jwt: []}],
  grouping: 'tags'
};

// if (process.env.HEROKU_APP_NAME) {
//   const name = process.env.HEROKU_APP_NAME;
//   if (name.includes('.')) {
//     swaggerOptions.host = process.env.HEROKU_APP_NAME;
//   } else {
//     swaggerOptions.host = `${process.env.HEROKU_APP_NAME}.herokuapp.com`;
//   }
// }

/**
 * Starts the server.
 */
async function startServer() {
  registerFeats();
  await server.register([
    inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);
  server.ext('onPreHandler', (request, h) => {
    const host = request.info.hostname;
    if (host.includes('herokuapp.com')) {
      swaggerOptions.host = host;
    }
    return h.continue;
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: (request, h) => {
      const {param} = request.params;
      if (param.includes('.')) {
        return h.file(param);
      }
      return h.file('index.html');
    }
  });
  await server.start();
  logger.info(`Server running at: ${server.info.uri}`);
  logger.info('Listening to Token Transfer events...');
  listenTokenTx();
}

// eslint-disable-next-line no-shadow, no-unused-vars
server.ext('onPostStop', server => {
  // onPostStop: called after the connection listeners are stopped
  // see: https://github.com/hapijs/hapi/blob/master/API.md#-serverextevents
  // app.database
  //   .disconnect()
  //   .then(() => process.exit(0))
  //   .catch((err) => {
  //     // eslint-disable-next-line no-console
  //     console.error(err);
  //     process.exit(1);
  //   });
});
let isStopping = false;
async function shutDown() {
  if (!isStopping) {
    logger.info('closing all listeners...');
    stopListener();
    logger.info('shutDown...');
    isStopping = true;
    const lapse = process.env.STOP_SERVER_WAIT_SECONDS ? process.env.STOP_SERVER_WAIT_SECONDS : 5;
    await server.stop({
      timeout: lapse * 1000
    });
  }
}

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

async function start() {
  await startServer();
  // await approveClaim();
}

start();
