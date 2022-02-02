const validators = require('./role.validators');
const controllers = require('./role.controllers');
const {ROLE_ADMIN} = require('../../constants/permissions');

const routes = {
  add: ['PUT', '', 'Add a new role', ROLE_ADMIN],
  list: ['GET', '', 'Get all the roles', ROLE_ADMIN],
  get: ['GET', '/{id}', 'Get a role by id', ROLE_ADMIN],
  delete: ['DELETE', '/{id}', 'Delete a role by id', ROLE_ADMIN],
  getPermissions: ['GET', '/{name}/permissions', 'Get permissions list by role', ROLE_ADMIN],
  addPermissions: ['PATCH', '/{id}/permissions', 'Add permissions to a role', ROLE_ADMIN],
  removePermissions: ['DELETE', '/{id}/permissions', 'Remove permissions from a role', ROLE_ADMIN]
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
  app.register({
    name: 'roles',
    routes,
    validators,
    controllers
  });
}

module.exports = register;
