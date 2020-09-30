const ethers = require('ethers');
const { getAbi, getInterface } = require('./abi');

function checkParams(funcSig, ...params) {
  const paramTypes = params.map((el) => typeof el);
  const inputTypes = funcSig.inputs.map((el) => {
    if (el.type === 'bool') {
      return 'boolean';
    }
    if (el.type.substring(0, 4) === 'uint' || el.type.substring(0, 3) === 'int') {
      return 'number';
    }

    return 'string';
  });

  if (JSON.stringify(paramTypes) !== JSON.stringify(inputTypes)) {
    throw Error('Invalid Arguments');
  }
  return true;
}

async function getEncodedData(contractName, functionName, ...params) {
  try {
    const ABI = await getAbi();
    const contractABI = ABI[contractName].abi;
    // chek the inputs type
    const funcSig = contractABI.find((el) => el.name === functionName);
    checkParams(funcSig, ...params);

    const iface = new ethers.utils.Interface(contractABI);
    const encoded = iface.encodeFunctionData(functionName, params);
    return encoded;
  } catch (e) {
    return e;
  }
}

async function getDecodedData(contractName, functionName, data) {
  try {
    const iface = await getInterface(contractName);
    const decoded = iface.decodeFunctionData(functionName, data);
    return decoded;
  } catch (e) {
    return e;
  }
}

async function parseTransaction(contractName, tx) {
  try {
    const iface = await getInterface(contractName);
    const data = iface.parseTransaction(tx);
    return data;
  } catch (e) {
    return e;
  }
}
async function parseLog(contractName, tx) {
  try {
    const iface = await getInterface(contractName);
    const data = iface.parseLog(tx);
    return data;
  } catch (e) {
    return e;
  }
}

module.exports = {
  getEncodedData,
  getDecodedData,
  parseTransaction,
  parseLog,
};
