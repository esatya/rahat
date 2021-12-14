const WebSocket = require('ws');
const crypto = require('crypto');

let clients = [];
let wss = null;

const create = server => {
  wss = new WebSocket.Server({server, clientTracking: true});

  wss.on('connection', ws => {
    const id = Math.floor(Math.random() * 999999 + 100000);
    ws.rsid = id;
    ws.sendJson = data => {
      ws.send(JSON.stringify(data));
    };
    clients.push({id, ws});

    ws.on('message', data => {
      try {
        data = JSON.parse(data);
        if (data.action === 'get_id') ws.sendJson({action: 'info', data: {id: ws.rsid}});
        if (data.action === 'register') {
          const client = clients.find(d => d.id === ws.rsid);
          client.name = data.name;
        }
        if (data.action === 'get_token') {
          const client = clients.find(d => d.id === ws.rsid);
          client.token = crypto.randomBytes(20).toString('hex');
          ws.sendJson({action: 'token', data: {id: ws.rsid, token: client.token}});
        }
      } catch (e) {
        ws.sendJson({action: 'error', message: 'Please send valid JSON data'});
      }
    });

    ws.on('close', () => {
      // console.log(`=======> WS: Client# ${ws.rsid} disappeared.`);
      clients = clients.filter(d => d.id !== ws.rsid);
    });

    // console.log(`=======> WS: Client# ${id} appeared.`);
    ws.sendJson({action: 'welcome', id: ws.rsid});
  });
};

const getClient = clientId => {
  if (!clientId) return 'Please send client id';
  let client = clients.find(d => d.id === parseInt(clientId, 10));
  if (!client) client = clients.find(d => d.name === clientId);
  return client;
};

const sendToClient = (clientId, data) => {
  try {
    if (typeof data === 'string') data = {message: data};
    const client = getClient(clientId);
    if (!client) return 'Invalid Client ID.';
    return client.ws.sendJson(data);
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

const getClientsList = () => clients.map(d => d.id);

module.exports = {
  create,
  wss,
  getClient,
  getClientsList,
  sendToClient
};
