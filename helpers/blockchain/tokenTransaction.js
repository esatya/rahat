const ethers = require('ethers');
const config = require('config');
const { ethersContract } = require('./contract');
const { getAbi } = require('./abi');
const { token } = require('../../config/settings.json');

const network = config.get('blockchain.httpProvider');
const provider = new ethers.providers.JsonRpcProvider(network);
const abi = getAbi('AidToken');
const tokenContract = ethersContract(abi, token);

async function tokenTransaction(account) {
  try {
    const filterTokenSent = tokenContract.filters.Transfer(account);
    filterTokenSent.fromBlock = 0;
    filterTokenSent.toBlock = 'latest';
    filterTokenSent.topic = [];
    const tokenSentTx = await provider.getLogs(filterTokenSent);
    const tokenSentLogs = tokenSentTx.map((el) => tokenContract.interface.parseLog(el));

    const filterTokenReceived = tokenContract.filters.Transfer(null, account);
    filterTokenReceived.fromBlock = 0;
    filterTokenReceived.toBlock = 'latest';
    filterTokenReceived.topic = [];
    const tokenReceivedTx = await provider.getLogs(filterTokenReceived);
    const tokenReceivedLogs = tokenReceivedTx.map((el) => tokenContract.interface.parseLog(el));

    return { received: tokenReceivedLogs, sent: tokenSentLogs };
  } catch (e) {
    throw Error(e);
  }
}

module.exports = { tokenTransaction };
