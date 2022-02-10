const fs = require('fs');
const ethers = require('ethers');
const config = require('config');
const axios = require('axios');
const app = require('../../app');

const packageJson = require('../../package.json');
const {Agency} = require('../agency/agency.controllers');
const {Project} = require('../project/project.controllers');
const {Vendor} = require('../vendor/vendor.controllers');
const {Mobilizer} = require('../mobilizer/mobilizer.controllers');
const {Beneficiary} = require('../beneficiary/beneficiary.controllers');
const {Institution} = require('../institution/institution.controllers');
const PermissionsConstants = require('../../constants/permissions');
const {ObjectUtils} = require('../../helpers/utils');

const settingsPath = `${__dirname}/../../config/settings.json`;
const privateKeyPath = `${__dirname}/../../config/privateKey.json`;
const {getAbi, getBytecode} = require('../../helpers/blockchain/abi');
const {User, getByWalletAddress} = require('../user/user.controllers');
const {Role} = require('../user/role.controllers');
const {deployContract} = require('../../helpers/blockchain/contract');

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
      is_system: true
    });

    // Setup new wallet for the server.
    // Please make sure you backup the private key securely.
    const wallet = ethers.Wallet.createRandom();
    fs.writeFileSync(privateKeyPath, JSON.stringify({privateKey: wallet.privateKey}));
    this.saveSetting('wallet_address', wallet.address);
    return {address: wallet.address};
  },

  async setup(payload) {
    let isSetup = false;
    let agency = await Agency.getFirst();
    if (agency) isSetup = true;
    if (isSetup) return app.error('Server has already been setup.', 500);
    const {token, admin} = payload;
    try {
      const contracts = await this.setupContracts(
        admin.wallet_address,
        token.name,
        token.symbol,
        token.supply
      );
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
      networkUrl: config.get('blockchain.httpProvider'),
      agency
    });
  },

  async getContractAbi(contractName) {
    return getAbi(contractName);
  },

  getContractBytecode(contractName) {
    return getBytecode(contractName);
  },

  async setupContracts(adminAccount, tokenName, tokenSymbol, initialSupply) {
    const {abi: tokenAbi} = getAbi('AidToken');
    const {bytecode: tokenBytecode} = getBytecode('AidToken');
    const {abi: rahatAbi} = getAbi('Rahat');
    const {bytecode: rahatBytecode} = getBytecode('Rahat');
    const {abi: rahatAdminAbi} = getAbi('RahatAdmin');
    const {bytecode: rahatAdminBytecode} = getBytecode('RahatAdmin');

    try {
      const token = await deployContract(tokenAbi, tokenBytecode, [
        tokenName,
        tokenSymbol,
        adminAccount
      ]);
      const rahat = await deployContract(rahatAbi, rahatBytecode, [token, adminAccount]);
      const rahat_admin = await deployContract(rahatAdminAbi, rahatAdminBytecode, [
        token,
        rahat,
        initialSupply,
        adminAccount
      ]);

      return {token, rahat, rahat_admin};
    } catch (e) {
      throw Error(`ERROR:${e}`);
    }
  },
  async getDashboardData(currentUser) {
    const projectCount = await Project.countProject(currentUser);
    const vendorCount = await Vendor.countVendor(currentUser);
    const beneficiary = await Beneficiary.countBeneficiary(currentUser);
    const mobilizerCount = await Mobilizer.countMobilizer(currentUser);
    const tokenAllocation = await Project.getTokenAllocated(currentUser);
    const tokenRedemption = await Vendor.countVendorTokenRedemption();
    const institutionCount = await Institution.countInstitution(currentUser);
    return {
      projectCount,
      vendorCount,
      institutionCount,
      beneficiary,
      mobilizerCount,
      tokenAllocation,
      tokenRedemption
    };
  },

  async setKobotoolbox(payload) {
    const {currentUser} = payload;
    const agency = await Agency.update(currentUser.agency, {
      kobotool_auth: {kpi: payload.kpi, token: payload.token}
    });
    return agency;
  },

  async getKoboForms(currentUser) {
    try {
      const {kobotool_auth} = await Agency.getById(currentUser.agency);
      const {data} = await axios.get(`https://${kobotool_auth.kpi}/api/v2/assets.json`, {
        headers: {Authorization: `Token ${kobotool_auth.token}`}
      });
      data.results = data.results.filter(
        el => el.has_deployment && el.name === 'Beneficiary Onboard'
      );
      const assets = await Agency.setKoboAssets(currentUser.agency, data.results);
      return assets;
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  async getKoboFormsData(currentUser, assetId) {
    try {
      const {kobotool_auth, kobotool_assets} = await Agency.getById(currentUser.agency);
      const {data} = await axios.get(
        `https://${kobotool_auth.kpi}/api/v2/assets/${
          assetId || kobotool_assets[0].asset_id
        }/data?format=json`,
        {headers: {Authorization: `Token ${kobotool_auth.token}`}}
      );
      return {count: data.count, data: data.results};
    } catch (e) {
      return e;
    }
  },

  async setAssetMappings() {}
};

module.exports = {
  App,
  setup: req => App.setup(req.payload),
  setupWallet: req => App.setupWallet(),
  listSettings: req => App.listSettings(),
  getContractAbi: req => App.getContractAbi(req.params.contractName),
  getContractBytecode: req => App.getContractBytecode(req.params.contractName),
  setupContracts: req => App.setupContracts(),
  getDashboardData: req => App.getDashboardData(req.currentUser),
  setKobotoolbox: req => App.setKobotoolbox(req.payload),
  getKoboForms: req => App.getKoboForms(req.currentUser),
  getKoboFormsData: req => App.getKoboFormsData(req.currentUser, req.params.assetId)
};
