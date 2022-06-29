const controllers = require('./otp.controllers');

const routes = {
  generate: ['POST', '', 'Generate OTP', []],
  verify: ['POST', '/verify', 'Generate OTP', []]
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
  app.register({
    name: 'otp',
    routes,
    controllers
  });
}

module.exports = register;
