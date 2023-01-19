const { getAbi, getBytecode, getInterface } = require('../../helpers/blockchain/abi');
const { Contract } = require('../../constants');

const randomProperty = obj => {
  const keys = Object.keys(obj);
  const randomIndex = keys[Math.floor(Math.random() * keys.length)];
  return randomIndex;
};

describe('Contract Helpers', () => {
  beforeAll(async () => { });

  afterAll(async () => { });

  it('should return abi of given contract name', () => {
    const contractName = randomProperty(Contract);
    const contractArtifact = require(`../../contracts/${contractName}.json`);
    const abi = getAbi(contractName);
    console.log(typeof abi)
    expect(typeof abi).toBe('object');
    expect(abi).toMatchObject({ contractName, abi: contractArtifact.abi });
  });

  it('should return bytecode of given contract name', () => {
    const contractName = randomProperty(Contract);
    const contractArtifact = require(`../../contracts/${contractName}.json`);
    const bytecode = getBytecode(contractName);

    expect(typeof bytecode).toBe('object');
    expect(bytecode).toMatchObject({ contractName, bytecode: contractArtifact.bytecode });
  });

  it('should return interface of given contract name', () => {
    const contractName = randomProperty(Contract);
    const iface = getInterface(contractName);

    expect(typeof iface).toBe('object');

  });
});
