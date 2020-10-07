const Ganache = require('ganache-core');
const Web3 = require('web3');
const { getAbi, getBytecode } = require('../../helpers/blockchain/abi');

describe('RahatAdmin', () => {
  let provider;
  let web3;
  let accounts;
  let rahatContract;
  let tokenContract;
  let rahatAdminContract;
  let testContract;
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
  });

  afterAll(async () => {
    provider.stop();
  });

  it('should test people count', async () => {
    const oldVal = await testContract.methods.peopleCount().call();
    await testContract.methods.addPerson('Manjik', 'Shrestha').send({ from: accounts[0], gas: 1000000 });

    const newVal = await testContract.methods.peopleCount().call();

    expect(oldVal).toBe('0');
    expect(newVal).toBe('1');
  });

  it('should check token name, symbol and  balance of admin ', async () => {
    const balance = await tokenContract.methods.balanceOf(accounts[0]).call();
    const name = await tokenContract.methods.name().call();
    const symbol = await tokenContract.methods.symbol().call();
    expect(balance).toBe('10000');
    expect(name).toBe('MANZ');
    expect(symbol).toBe('MZ');
  });

  it('should mint token to specified account', async () => {
    const tokenToMint = '1000';
    const oldBalance = await tokenContract.methods.balanceOf(accounts[1]).call();
    await tokenContract.methods.mintToken(accounts[1], Number(tokenToMint)).send({ from: accounts[0], gas: 1000000 });
    const newBalance = await tokenContract.methods.balanceOf(accounts[1]).call();
    expect(oldBalance).toBe('0');
    expect(newBalance).toBe(tokenToMint);
  });

  it('should set project budget and send token to Rahat contract', async () => {
    const projectId = 'rahat101';
    const projectCapital = '2000';
    await rahatAdminContract.methods.setProjectBudget(projectId, Number(projectCapital)).send({ from: accounts[0], gas: 1000000 });
    const projectBalance = await rahatAdminContract.methods.getProjectBalance(projectId).call({ from: accounts[0] });
    const rahatTokenBalance = await tokenContract.methods.balanceOf(rahatContract._address).call();

    expect(projectBalance).toBe(projectCapital);
    expect(rahatTokenBalance).toBe(projectBalance);
  });

  it('Only Admin Account can set project budget', async () => {
    const projectId = 'rahat101';
    const projectCapital = '2000';
    const nonAdminAccount = accounts[1];
    const projectBudgetTranasction = async () => {
      try {
        const tx = await rahatAdminContract.methods.setProjectBudget(projectId, Number(projectCapital)).send({ from: nonAdminAccount, gas: 1000000 });
      } catch (e) {
        expect(e).toMatch('Only Admin can execute this transaction');
      }
    };
  });
});
