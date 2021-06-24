const Ganache = require('ganache-core');
const Web3 = require('web3');
const { getAbi, getBytecode } = require('../../helpers/blockchain/abi');

describe('Rahat', () => {
  let provider;
  let web3;
  let accounts;
  let rahatContract;
  let tokenContract;
  let rahatAdminContract;
  let testContract;
  let projectId;
  let vendorAccount;
  let beneficiary;
  let OTP;
  let claimAmount;
  beforeAll(async () => {
    const test = {};
    const token = {};
    const rahat = {};
    const rahatAdmin = {};
    test.abi = getAbi('Test').abi;
    test.bytecode = getBytecode('Test').bytecode;
    token.abi = getAbi('AidToken').abi;
    token.bytecode = getBytecode('AidToken').bytecode;
    rahat.abi = getAbi('Rahat').abi;
    rahat.bytecode = getBytecode('Rahat').bytecode;
    rahatAdmin.abi = getAbi('RahatAdmin').abi;
    rahatAdmin.bytecode = getBytecode('RahatAdmin').bytecode;

    provider = Ganache.provider();
    web3 = new Web3(provider);
    accounts = await web3.eth.getAccounts();

    test.instance = new web3.eth.Contract(test.abi);
    token.instance = new web3.eth.Contract(token.abi);
    rahat.instance = new web3.eth.Contract(rahat.abi);
    rahatAdmin.instance = new web3.eth.Contract(rahatAdmin.abi);

    testContract = await test.instance
      .deploy({ data: test.bytecode })
      .send({ from: accounts[0], gas: 1500000 });
    tokenContract = await token.instance
      .deploy({ data: token.bytecode, arguments: ['MANZ', 'MZ', accounts[0]] })
      .send({ from: accounts[0], gas: 1500000 });
    rahatContract = await rahat.instance
      .deploy({ data: rahat.bytecode, arguments: [tokenContract._address, accounts[0]] })
      .send({ from: accounts[0], gas: 3500000 });
    rahatAdminContract = await rahatAdmin.instance
      .deploy({ data: rahatAdmin.bytecode, arguments: [tokenContract._address, rahatContract._address, 1000000, accounts[0]] })
      .send({ from: accounts[0], gas: 2500000 });

    projectId = 'rahat101';
    const projectCapital = '200000';
    vendorAccount = accounts[2];
    beneficiary = 9841602388;

    await rahatAdminContract.methods.setProjectBudget(projectId, Number(projectCapital)).send({ from: accounts[0], gas: 1000000 });
  });

  afterAll(async () => {
    provider.stop();
  });

  it('should issue token to given number', async () => {
    const issueAmount = '100';

    const oldTokenBalance = await rahatContract.methods.tokenBalance(beneficiary).call();

    await rahatContract.methods.issueToken(projectId, 9841602388, issueAmount).send({ from: accounts[0], gas: 1000000 });
    const newTokenBalance = await rahatContract.methods.tokenBalance(beneficiary).call();

    expect(oldTokenBalance).toBe('0');
    expect(newTokenBalance).toBe(issueAmount);
  });

  it('should add vendor to the Rahat Contract', async () => {
    const vendorRole = await rahatContract.methods.VENDOR_ROLE().call();
    const isVendorBefore = await rahatContract.methods.hasRole(vendorRole, vendorAccount).call();

    await rahatContract.methods.addVendor(accounts[2]).send({ from: accounts[0], gas: 1000000 });

    const isVendorAfter = await rahatContract.methods.hasRole(vendorRole, vendorAccount).call();

    expect(isVendorBefore).toBe(false);
    expect(isVendorAfter).toBe(true);
  });

  it('should claim token from registered beneficiary', async () => {
    claimAmount = '100';

    await rahatContract.methods.createClaim(beneficiary, Number(claimAmount)).send({ from: vendorAccount, gas: 1000000 });

    const claims = await rahatContract.methods.recentClaims(vendorAccount, beneficiary).call();

    expect(claims.amount).toBe(claimAmount);
    expect(claims.isReleased).toBe(false);
  });
  // TODO should listen to claim event

  it('should approve claim requested from vendors', async () => {
    OTP = '1212';
    otpHash = web3.utils.soliditySha3({ type: 'string', value: OTP });
    const timeToLive = 900;

    await rahatContract.methods.approveClaim(vendorAccount, beneficiary, otpHash, timeToLive)
      .send({ from: accounts[0], gas: 1000000 });

    const claims = await rahatContract.methods.recentClaims(vendorAccount, beneficiary).call();

    expect(claims.isReleased).toBe(true);
    expect(claims.otpHash).toBe(otpHash);
  });

  it("should not get tokens if OTP didn't match", async () => {
    const getTokenTx = async () => {
      try {
        await rahatContract.methods.getTokensFromClaim(beneficiary, '1010').send({ from: vendorAccount, gas: 1000000 });
      } catch (e) {
        expect(e).toMatch('RAHAT: OTP did not match.');
      }
    };
  });

  it('should get tokens if OTP match', async () => {
    const vendorBalanceBefore = await tokenContract.methods.balanceOf(vendorAccount).call();

    await rahatContract.methods.getTokensFromClaim(beneficiary, OTP).send({ from: vendorAccount, gas: 1000000 });

    const vendorBalanceAfter = await tokenContract.methods.balanceOf(vendorAccount).call();
    expect(vendorBalanceBefore).toBe('0');
    expect(vendorBalanceAfter).toBe(claimAmount);
  });
});
