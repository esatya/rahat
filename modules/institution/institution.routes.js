const validators = require('./institution.validators');
const controllers = require('./institution.controllers');
const { INSTITUTION } = require('../../constants/permissions');

const routes = {
  list: [
    'GET', '',
    'List all the financial institutions',
    [INSTITUTION.READ, INSTITUTION.ADMIN],
  ],
  add: [
    'POST', '',
    'Add a financial institutions',
    [INSTITUTION.WRITE, INSTITUTION.ADMIN],
  ],
  getById: [
    'GET', '/{id}',
    'Get a financial institutions by Id',
    [INSTITUTION.READ, INSTITUTION.ADMIN],
  ],
  remove: [
    'DELETE', '/{id}',
    'Remove and archive a financial institutions',
    [INSTITUTION.REMOVE, INSTITUTION.ADMIN],
  ],
  update: [
    'PUT', '/{id}',
    'Update financial institutions details',
    [INSTITUTION.WRITE, INSTITUTION.ADMIN],
  ],
  changeStatus: [
    'PATCH', '/{id}/status',
    'Update financial institutions status',
    [INSTITUTION.WRITE, INSTITUTION.ADMIN],
  ],
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
  app.register({
    name: 'institutions', routes, validators, controllers,
  });
}

module.exports = register;
