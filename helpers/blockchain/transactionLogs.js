const ethers = require('ethers');
const config = require('config');
const {ethersContract} = require('./contract');
const {getAbi} = require('./abi');

const network = config.get('blockchain.httpProvider');
const provider = new ethers.providers.JsonRpcProvider(network);
const erc20Abi = getAbi('RahatERC20');
const rahatAbi = getAbi('Rahat');
const erc1155Abi = getAbi('RahatERC1155');

async function tokenTransaction(tokenAddress, rahatAddress, account) {
  const rahatContract = ethersContract(rahatAbi, rahatAddress);
  const tokenContract = ethersContract(erc20Abi, tokenAddress);
  try {
    const filterTokenReceived = rahatContract.filters.ClaimAcquiredERC20(account);
    filterTokenReceived.fromBlock = 12410952;
    filterTokenReceived.toBlock = 'latest';
    const tokenReceivedTx = await provider.getLogs(filterTokenReceived);
    const tokenReceivedLogs = tokenReceivedTx.map(el => {
      let {
        args: {vendor: from, beneficiary: to, amount: value}
      } = rahatContract.interface.parseLog(el);
      value = value.toNumber();
      to = to.toNumber();
      const {blockNumber, transactionHash} = el;
      return {
        from,
        to,
        value,
        blockNumber,
        transactionHash,
        tag: 'received'
      };
    });

    const filterTokenSent = tokenContract.filters.Transfer(account);
    filterTokenSent.fromBlock = 12480952;
    filterTokenSent.toBlock = 'latest';
    filterTokenSent.topic = [];
    const tokenSentTx = await provider.getLogs(filterTokenSent);
    const tokenSentLogs = tokenSentTx.map(el => {
      let {
        args: {from, to, value}
      } = tokenContract.interface.parseLog(el);
      value = value.toNumber();
      const {blockNumber, transactionHash} = el;
      return {
        from,
        to,
        value,
        blockNumber,
        transactionHash,
        tag: 'sent'
      };
    });

    const allTx = [...tokenReceivedLogs, ...tokenSentLogs];
    allTx.sort((a, b) => a.blockNumber - b.blockNumber);
    return allTx;
  } catch (e) {
    throw Error(e);
  }
}

async function nftTransaction(erc1155Address, rahatAddress, account) {
  const rahatContract = ethersContract(rahatAbi, rahatAddress);
  // const nftContract = ethersContract(erc20Abi, erc1155Address);
  try {
    const filterPackagesReceived = rahatContract.filters.ClaimAcquiredERC1155(account);
    filterPackagesReceived.fromBlock = 12480952;
    filterPackagesReceived.toBlock = 'latest';
    const packageReceivedTx = await provider.getLogs(filterPackagesReceived);
    const packageReceivedLogs = packageReceivedTx.map(el => {
      let {
        args: {vendor: from, beneficiary: to, amount: value, tokenId}
      } = rahatContract.interface.parseLog(el);
      value = value.toNumber();
      to = to.toNumber();
      tokenId = tokenId.toNumber();
      const {blockNumber, transactionHash} = el;
      return {
        from,
        to,
        value,
        tokenId,
        blockNumber,
        transactionHash,
        tag: 'received'
      };
    });

    const allTx = [...packageReceivedLogs];
    allTx.sort((a, b) => a.blockNumber - b.blockNumber);
    return allTx;
  } catch (e) {
    throw Error(e);
  }
}

module.exports = {tokenTransaction, nftTransaction};
