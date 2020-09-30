const Web3 = require('web3');
const config = require('config');

const web3 = new Web3(new Web3.providers.HttpProvider(config.get('blockchain.httpProvider')));
const wsWeb3 = new Web3(new Web3.providers.WebsocketProvider(config.get('blockchain.webSocketProvider')));

function generateHash(data) {
  return Web3.utils.soliditySha3({ type: 'string', value: data });
}

module.exports = {
  web3,
  wsWeb3,
  generateHash,
};
