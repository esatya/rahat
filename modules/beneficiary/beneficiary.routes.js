const validators = require('./beneficiary.validators');
const controllers = require('./beneficiary.controllers');
const {BENEFICIARY} = require('../../constants/permissions');

const routes = {
  list: ['GET', '', 'List all beneficiarys.', [BENEFICIARY.READ, BENEFICIARY.ADMIN]],
  add: ['POST', '', 'Add a beneficiary.', [BENEFICIARY.WRITE, BENEFICIARY.ADMIN]],
  addMany: ['POST', '/bulk', 'Add a beneficiary in bulk', [BENEFICIARY.WRITE, BENEFICIARY.ADMIN]],
  getbyId: [
    'GET',
    '/{id}',
    'Get an beneficiary by Phone , Wallet Adress or id.',
    [BENEFICIARY.READ, BENEFICIARY.ADMIN]
  ],
  checkBeneficiary: [
    'GET',
    '/check/{phone}',
    'check an beneficiary by Phone , Wallet Adress or id.'
  ],
  update: ['PUT', '/{id}', 'Update beneficiary details.', [BENEFICIARY.WRITE, BENEFICIARY.ADMIN]],
  updateIssuedPackages: [
    'PATCH',
    '/{id}/update-packages',
    'Update issued packages',
    [BENEFICIARY.WRITE, BENEFICIARY.ADMIN]
  ],
  remove: [
    'DELETE',
    '/{id}',
    'Remove and archive a beneficiary,',
    [BENEFICIARY.REMOVE, BENEFICIARY.ADMIN]
  ],
  distributeToken: [
    'POST',
    '/tx/beneficiary-token',
    'add tx for Distribute token to beneficiary',
    [BENEFICIARY.WRITE, BENEFICIARY.ADMIN]
  ],
  addToProjectByBenfId: [
    'POST',
    '/{id}/add-to-project',
    'Add beneficiary to project',
    [BENEFICIARY.WRITE, BENEFICIARY.ADMIN]
  ],
  listTokenDistributions: [
    'GET',
    '/{id}/token',
    'List token distributions to beneficiary',
    [BENEFICIARY.READ, BENEFICIARY.ADMIN]
  ]
};

function register(app) {
  app.register({
    name: 'beneficiaries',
    routes,
    validators,
    controllers
  });
}

module.exports = register;
