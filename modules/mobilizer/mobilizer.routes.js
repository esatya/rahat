const validators = require('./mobilizer.validators');
const controllers = require('./mobilizer.controllers');
const {MOBILIZER, VENDOR} = require('../../constants/permissions');

const routes = {
  list: ['GET', '', 'List all Mobilizers.', [VENDOR.READ, VENDOR.ADMIN]],
  add: ['POST', '', 'Add a MOBILIZER.', [VENDOR.WRITE, VENDOR.ADMIN]],
  getbyId: ['GET', '/{id}', 'Get an MOBILIZER by Wallet Adress or id.'],
  update: ['PUT', '/{id}', 'Update MOBILIZER details.', [VENDOR.WRITE, VENDOR.ADMIN]],
  remove: ['DELETE', '/{id}', 'Remove and archive a MOBILIZER,', [VENDOR.REMOVE, VENDOR.ADMIN]],
  approve: [
    'PATCH',
    '/approve',
    'Approves MOBILIZER to interact with projects of this agency',
    [VENDOR.WRITE, VENDOR.ADMIN]
  ],
  changeStatus: ['PATCH', '/{id}/status', 'Change Vendors Status', [VENDOR.WRITE, VENDOR.ADMIN]],
  updateStatusInProject: [
    'PATCH',
    '/{id}/project-status',
    'Change status in project',
    [VENDOR.WRITE]
  ],
  register: ['POST', '/register', 'register a MOBILIZER.'],
  getTransactions: ['GET', '/{id}/transactions', 'Get the token transactions by current MOBILIZER'],
  addTokenIssueTx: ['POST', '/tx/issue-token', 'Add the token issuance transaction from mobilizer'],
  listTokenIssueTx: ['GET', '/tx/issue-token/{mobilizerId}', 'List tokens issued by mobilizer']
};

function register(app) {
  app.register({
    name: 'mobilizers',
    routes,
    validators,
    controllers
  });
}

module.exports = register;
