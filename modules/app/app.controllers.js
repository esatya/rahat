const fs = require('fs');
const ethers = require('ethers');
const app = require('../../app');

const packageJson = require('../../package.json');
const { Agency } = require('../agency/agency.controllers');
const PermissionsConstants = require('../../constants/permissions');
const { ObjectUtils } = require('../../helpers/utils');

const settingsPath = `${__dirname}/../../config/settings.json`;
const privateKeyPath = `${__dirname}/../../config/privateKey.json`;
const { getAbi, getBytecode } = require('../../helpers/blockchain/abi');
const { User, getByWalletAddress } = require('../user/user.controllers');
const { Role } = require('../user/role.controllers');
const { deployContract } = require('../../helpers/blockchain/contract');

const App = {
  saveSetting(name, value) {
    let settings = fs.readFileSync(settingsPath);
    settings = JSON.parse(settings);
    settings[name] = value;
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  },

  getSetting(name) {
    let settings = fs.readFileSync(settingsPath);
    settings = JSON.parse(settings);
    return settings[name];
  },

  async setupWallet() {
    const agency = await Agency.getFirst();
    if (agency) return app.error('Server has already been setup.', 500);
    // Create Admin role
    const permissions = ObjectUtils.getAllValues(PermissionsConstants);
    await Role.add({
      name: 'Admin',
      permissions,
      is_system: true,
    });

    // Setup new wallet for the server.
    // Please make sure you backup the private key securely.
    const wallet = ethers.Wallet.createRandom();
    fs.writeFileSync(privateKeyPath, JSON.stringify({ privateKey: wallet.privateKey }));
    this.saveSetting('wallet_address', wallet.address);
    return { address: wallet.address };
  },

  async setup(payload) {
    let isSetup = false;
    let agency = await Agency.getFirst();
    if (agency) isSetup = true;
    if (isSetup) return app.error('Server has already been setup.', 500);
    const { token, admin } = payload;
    try {
      const contracts = await this.setupContracts(admin.wallet_address, token.name, token.symbol, token.supply);
      // const settingsData = JSON.parse(fs.readFileSync(settingsPath));
      // settingsData.contracts = contracts;
      // fs.writeFileSync(settingsPath, JSON.stringify(settingsData));
      payload.contracts = contracts;
      agency = await Agency.add(payload);
      await Agency.approve(agency._id);
      payload.admin.roles = ['Admin'];
      payload.admin.agency = agency._id;
      await User.create(payload.admin);
      const settings = await this.listSettings();
      settings.user = await getByWalletAddress(payload.admin.wallet_address);

      return settings;
    } catch (e) {
      throw Error(e);
    }
  },

  async listSettings() {
    let settings = fs.readFileSync(settingsPath);
    settings = JSON.parse(settings);
    const agency = await Agency.getFirst();
    return Object.assign(settings, {
      isSetup: agency != null,
      version: packageJson.version,
      agency,
    });
  },

  async getContractAbi(contractName) {
    return getAbi(contractName);
  },

  getContractBytecode(contractName) {
    return getBytecode(contractName);
  },

  async setupContracts(adminAccount, tokenName, tokenSymbol, initialSupply) {
    const { abi: tokenAbi } = getAbi('AidToken');
    const { bytecode: tokenBytecode } = getBytecode('AidToken');
    const { abi: rahatAbi } = getAbi('Rahat');
    const { bytecode: rahatBytecode } = getBytecode('Rahat');
    const { abi: rahatAdminAbi } = getAbi('RahatAdmin');
    const { bytecode: rahatAdminBytecode } = getBytecode('RahatAdmin');

    try {
      const token = await deployContract(tokenAbi, tokenBytecode, [tokenName, tokenSymbol, adminAccount]);
      const rahat = await deployContract(rahatAbi, rahatBytecode, [token, adminAccount]);
      const rahat_admin = await deployContract(
        rahatAdminAbi,
        rahatAdminBytecode,
        [token, rahat, initialSupply, adminAccount],
      );

      return { token, rahat, rahat_admin };
    } catch (e) {
      throw Error(`ERROR:${e}`);
    }
  },

};

module.exports = {
  App,
  setup: (req) => App.setup(req.payload),
  setupWallet: (req) => App.setupWallet(),
  listSettings: (req) => App.listSettings(),
  getContractAbi: (req) => App.getContractAbi(req.params.contractName),
  getContractBytecode: (req) => App.getContractBytecode(req.params.contractName),
  setupContracts: (req) => App.setupContracts(),
};
