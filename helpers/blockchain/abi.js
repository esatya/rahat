const fs = require('fs');
const path = require('path');
const ethers = require('ethers');

const buildPath = path.join(__dirname, '../../contracts/');

const getAbiCollection = () => {
  const data = fs.readdirSync(buildPath);
  const artifact = {};
  for (let i = 0; i < data.length; i++) {
    const content = fs.readFileSync(buildPath + data[i]).toString('utf8');
    const name = `${data[i].replace(/\.[^/.]+$/, '')}`;
    const { abi, contractName, bytecode } = JSON.parse(content);
    artifact[name] = { abi, contractName, bytecode };
  }
  return artifact;
};

const getBytecode = (contract) => {
  const abiColl = getAbiCollection();
  const { contractName, abi, bytecode } = abiColl[contract];
  return { contractName, abi, bytecode };
};

const getAbi = (contract) => {
  const abiColl = getAbiCollection();
  const { contractName, abi } = abiColl[contract];
  return { contractName, abi };
};

const getInterface = async (contractName) => {
  try {
    const ABI = await getAbi();
    const contractABI = ABI[contractName].abi;
    const iface = new ethers.utils.Interface(contractABI);
    return iface;
  } catch (e) {
    return e;
  }
};

module.exports = {
  getAbi, getAbiCollection, getBytecode, getInterface,
};
