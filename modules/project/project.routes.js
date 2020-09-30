const validators = require('./project.validators');
const controllers = require('./project.controllers');
const { PROJECT, BENEFICIARY } = require('../../constants/permissions');

const routes = {
  list: [
    'GET', '',
    'List all the agencies projects',
    [PROJECT.READ, PROJECT.ADMIN],
  ],
  add: [
    'POST', '',
    'Add a project',
    [PROJECT.WRITE, PROJECT.ADMIN],
  ],
  getById: [
    'GET', '/{id}',
    'Get a project by Id',
    [PROJECT.READ, PROJECT.ADMIN],
  ],
  remove: [
    'DELETE', '/{id}',
    'Remove and archive a project',
    [PROJECT.REMOVE, PROJECT.ADMIN],
  ],
  update: [
    'PUT', '/{id}',
    'Update project details',
    [PROJECT.WRITE, PROJECT.ADMIN],
  ],
  changeStatus: [
    'PATCH', '/{id}/status',
    'Update project status',
    [PROJECT.WRITE, PROJECT.ADMIN],
  ],
  addTokenAllocation: [
    'PATCH', '/{id}/token',
    'Add token allocation to the project',
    [PROJECT.WRITE, PROJECT.ADMIN],
  ],
  addBeneficiary: [
    'POST', '/{id}/beneficiaries',
    'Add beneficiary to the project',
    [BENEFICIARY.WRITE, BENEFICIARY.ADMIN],
  ],
  listBeneficiaries: [
    'GET', '/{id}/beneficiaries',
    'List beneficiaries registered to the project',
    [BENEFICIARY.READ, BENEFICIARY.ADMIN],
  ],
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
  app.register({
    name: 'projects', routes, validators, controllers,
  });
}

module.exports = register;
