const validators = require('./nft.validators');
const controllers = require('./nft.controller');
const {PROJECT, VENDOR} = require('../../constants/permissions');

const routes = {
  listByProject: ['GET', '/{id}/list', 'List nfts by project', [PROJECT.READ]],
  add: ['POST', '', 'Add new nft', [PROJECT.WRITE]],
  getById: ['GET', '/{id}', 'Get nft by Id', [PROJECT.READ]],
  getByTokenId: ['GET', '/token/{id}', 'Get nft by tokenId'],
  mintTokens: ['PATCH', '/{id}/mint', 'Mint nft', [PROJECT.WRITE]],
  getTotalPackageBalance: ['POST', '/total-package-balance', 'Get total package balance in fiat'],
  getTokenIdsByProjects: [
    'POST',
    '/fetch-project-tokens',
    'List tokenIds by multiple projects',
    [PROJECT.READ]
  ],
  getVendorPackageBalance: [
    'POST',
    '/vendor-package-balance',
    'Get vendor package balance',
    [VENDOR.READ]
  ]
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
  app.register({
    name: 'nft',
    routes,
    validators,
    controllers
  });
}

module.exports = register;
