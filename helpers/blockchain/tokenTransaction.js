const ethers = require('ethers');
const config = require('config');
const { ethersContract } = require('./contract');
const { getAbi } = require('./abi');
const { token } = require('../../config/settings.json');

const network = config.get('blockchain.httpProvider');
const provider = new ethers.providers.JsonRpcProvider(network);
const abi = getAbi('RahatERC20');

async function tokenTransaction(tokenAddress, account) {
  try {
    const tokenContract = ethersContract(abi, tokenAddress);
    const filterTokenSent = tokenContract.filters.Transfer(account);
    filterTokenSent.fromBlock = 0;
    filterTokenSent.toBlock = 'latest';
    filterTokenSent.topic = [];
    const tokenSentTx = await provider.getLogs(filterTokenSent);
    const tokenSentLogs = tokenSentTx.map((el) => {
      let { args: { from, to, value } } = tokenContract.interface.parseLog(el);
      value = value.toNumber();
      const { blockNumber, transactionHash } = el;
      return {
        from, to, value, blockNumber, transactionHash, tag: 'sent',
      };
    });

    const filterTokenReceived = tokenContract.filters.Transfer(null, account);
    filterTokenReceived.fromBlock = 0;
    filterTokenReceived.toBlock = 'latest';
    filterTokenReceived.topic = [];
    const tokenReceivedTx = await provider.getLogs(filterTokenReceived);
    const tokenReceivedLogs = tokenReceivedTx.map((el) => {
      let { args: { from, to, value } } = tokenContract.interface.parseLog(el);
      value = value.toNumber();
      const { blockNumber, transactionHash } = el;
      return {
        from, to, value, blockNumber, transactionHash, tag: 'received',
      };
    });

    const allTx = [...tokenReceivedLogs, ...tokenSentLogs];
    allTx.sort((a, b) => a.blockNumber - b.blockNumber);
    return allTx;
  } catch (e) {
    throw Error(e);
  }
}

module.exports = { tokenTransaction };
