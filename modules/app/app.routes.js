const controllers = require('./app.controllers');
const validators = require('./app.validators');

const routes = {
  listSettings: {
    method: 'GET',
    path: '/settings',
    description: 'List all the application settings',
  },
  setup: {
    method: 'POST',
    path: '/setup',
    description: 'Setup a new server for the first time',
  },
  setupWallet: {
    method: 'GET',
    path: '/setup/wallet',
    description: 'Setup a new server wallet',
  },
  getContractAbi: {
    method: 'GET',
    path: '/contracts/{contractName}',
    description: 'Get a contracts artifacts',
  },
  getContractBytecode: {
    method: 'GET',
    path: '/contracts/{contractName}/bytecode',
    description: 'Get a contracts bytecode',
  },
  setupContracts: {
    method: 'GET',
    path: '/setup/contracts',
    description: 'setup a contracts and deploy to blockchain',
  },

};

function register(app) {
  app.register({
    name: 'app', routes, validators, controllers,
  });
}

module.exports = register;
