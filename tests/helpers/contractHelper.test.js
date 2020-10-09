const { getAbi, getBytecode } = require('../../helpers/blockchain/abi');
const { Contract } = require('../../constants');

const randomProperty = (obj) => {
  const keys = Object.keys(obj);
  const randomIndex = keys[Math.floor(Math.random() * keys.length)];
  return randomIndex;
};

describe('Contract Helpers', () => {
  beforeAll(async () => {

  });

  afterAll(async () => {

  });

  it('should return abi of given contract name', () => {
    const contractName = randomProperty(Contract);
    const contractArtifact = require(`../../contracts/build/${contractName}.json`);
    const abi = getAbi(contractName);

    expect(typeof abi).toBe('object');
    expect(abi).toMatchObject({ contractName, abi: contractArtifact.abi });
  });

  it('should return bytecode of given contract name', () => {
    const contractName = randomProperty(Contract);
    const contractArtifact = require(`../../contracts/build/${contractName}.json`);
    const bytecode = getBytecode(contractName);

    expect(typeof bytecode).toBe('object');
    expect(bytecode).toMatchObject({ contractName, bytecode: contractArtifact.bytecode });
  });
});
