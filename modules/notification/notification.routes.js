const validators = require('./notification.validator');
const controllers = require('./notification.controller');

const routes = {
  create: ['POST', '', 'Add new notification', []],
  list: ['GET', '', 'List all notifications.', []],
  update: ['PATCH', '/update/{id}', 'Update notifications.', []]
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
  app.register({
    name: 'notifications',
    routes,
    validators,
    controllers
  });
}

module.exports = register;
