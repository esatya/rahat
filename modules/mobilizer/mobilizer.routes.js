const validators = require('./mobilizer.validators');
const controllers = require('./mobilizer.controllers');
const { MOBILIZER, VENDOR } = require('../../constants/permissions');

const routes = {
  list: [
    'GET', '',
    'List all vendors.',
    [VENDOR.READ, VENDOR.ADMIN],
  ],
  add: [
    'POST', '',
    'Add a MOBILIZER.',
    [VENDOR.WRITE, VENDOR.ADMIN],
  ],
  getbyId: [
    'GET', '/{id}',
    'Get an MOBILIZER by Wallet Adress or id.',

  ],
  update: [
    'PUT', '/{id}',
    'Update MOBILIZER details.',
    [VENDOR.WRITE, VENDOR.ADMIN],
  ],
  remove: [
    'DELETE', '/{id}',
    'Remove and archive a MOBILIZER,',
    [VENDOR.REMOVE, VENDOR.ADMIN],
  ],
  approve: ['PATCH', '/approve',
    'Approves MOBILIZER to interact with projects of this agency',
    [VENDOR.WRITE, VENDOR.ADMIN],
  ],
  changeStatus: ['PATCH', '/{id}/status',
    'Change Vendors Status',
    [VENDOR.WRITE, VENDOR.ADMIN]],
  register: [
    'POST', '/register',
    'register a MOBILIZER.',
  ],
  getTransactions: [
    'GET',
    '/{id}/transactions',
    'Get the token transactions by current MOBILIZER',
  ],
};

function register(app) {
  app.register({
    name: 'mobilizers', routes, validators, controllers,
  });
}

module.exports = register;
