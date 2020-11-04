const validators = require('./agency.validators');
const controllers = require('./agency.controllers');
const { AGENCY } = require('../../constants/permissions');

const routes = {
  getById: ['GET', '/{id}',
    'Get an agency by id.',
    [AGENCY.READ, AGENCY.ADMIN],
  ],
  update: ['PUT', '/{id}',
    'Update the agency information',
    [AGENCY.WRITE, AGENCY.ADMIN],
  ],
  setContracts: ['PATCH', '/{id}/contracts',
    'Update contract addresses controlled by the agency',
    [AGENCY.WRITE, AGENCY.ADMIN],
  ],

};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
  app.register({
    name: 'agency', routes, validators, controllers,
  });
}

module.exports = register;
