const ethers = require('ethers');
const config = require('config');
const {web3, wsWeb3} = require('./web3');
const {getAbi} = require('./abi');

const network = config.get('blockchain.httpProvider');
const provider = new ethers.providers.JsonRpcProvider(network);

function ethersContract(artifact, contractAddress) {
  try {
    if (!provider) {
      throw Error('Cannot connect to chain');
    }
    const cashAidInstance = new ethers.Contract(contractAddress, artifact.abi, provider);

    return cashAidInstance;
  } catch (error) {
    throw Error(`ERROR: ${error}, message: Cannot instantiate contract`);
  }
}

function web3Contract(contractName, contractAddress) {
  const contract = getAbi(contractName);
  const instance = new web3.eth.Contract(contract.abi, contractAddress);

  return instance;
}

function wsWeb3Contract(contractName, contractAddress) {
  const contract = getAbi(contractName);
  const wsInstance = new wsWeb3.eth.Contract(contract.abi, contractAddress);
  return wsInstance;
}
async function deployContract(abi, bytecode, args) {
  const {privateKey} = require('../../config/privateKey.json');
  const signer = new ethers.Wallet(privateKey, provider);
  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const contract = await factory.deploy(...args);

  contract.deployTransaction.wait();
  return contract.address;
}

module.exports = {
  ethersContract,
  web3Contract,
  wsWeb3Contract,
  deployContract
};
