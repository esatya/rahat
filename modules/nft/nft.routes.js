const validators = require('./nft.validators');
const controllers = require('./nft.controller');
const { PROJECT } = require('../../constants/permissions');

const routes = {
	listByProject: ['GET', '/{id}/list', 'List nfts by project', [PROJECT.READ]],
	add: ['POST', '', 'Add new nft', [PROJECT.WRITE]],
	getById: ['GET', '/{id}', 'Get nft by Id', [PROJECT.READ]],
	mintTokens: ['PATCH', '/{id}/mint', 'Mint nft', [PROJECT.WRITE]],
	getTotalPackageBalance: ['POST', '/total-package-balance', 'Fetch total package balance in fiat', [PROJECT.READ]],
	getTokenIdsByProjects: ['POST', '/fetch-project-tokens', 'Fetch tokenIds by multiple projects']
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
