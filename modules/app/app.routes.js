const controllers = require('./app.controllers');
const validators = require('./app.validators');
const { AGENCY } = require('../../constants/permissions');

const routes = {
  listSettings: {
    method: 'GET',
    path: '/settings',
    description: 'List all the application settings',
  },
  setup: {
    method: 'POST',
    path: '/setup',
    description: 'Setup a new server for the first time',
  },
  setupWallet: {
    method: 'GET',
    path: '/setup/wallet',
    description: 'Setup a new server wallet',
  },
  getContractAbi: {
    method: 'GET',
    path: '/contracts/{contractName}',
    description: 'Get a contracts artifacts',
  },
  getContractBytecode: {
    method: 'GET',
    path: '/contracts/{contractName}/bytecode',
    description: 'Get a contracts bytecode',
  },
  setupContracts: {
    method: 'GET',
    path: '/setup/contracts',
    description: 'setup a contracts and deploy to blockchain',
  },
  getDashboardData: [
    'GET', '/dashboards', 'Get the dashboard informations',
    [AGENCY.WRITE, AGENCY.ADMIN],

  ],

  setKobotoolbox: [
    'PUT', '/kobotoolbox/setup', 'SetUp the kobotoolbox',
    [AGENCY.WRITE, AGENCY.ADMIN],
  ],

  getKoboForms: [
    'GET', '/kobotoolbox', 'Get all kobotoolbox forms',
    [AGENCY.WRITE, AGENCY.ADMIN],
  ],

  getKoboFormsData: [
    'GET', '/kobotoolbox/{assetId}', 'Get kobotoolbox data',
    [AGENCY.WRITE, AGENCY.ADMIN],
  ],

  setAssetMappings: [
    'PUT', '/kobotoolbox/maps', 'Set Kobo forms maps to rahat',
    [AGENCY.WRITE, AGENCY.ADMIN],
  ],

};

function register(app) {
  app.register({
    name: 'app', routes, validators, controllers,
  });
}

module.exports = register;
