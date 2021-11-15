const validators = require('./nft.validators');
const controllers = require('./nft.controller');
const { PROJECT } = require('../../constants/permissions');

const routes = {
	listByProject: ['GET', '/{id}/list', 'List nfts by project', [PROJECT.READ]],
	add: ['POST', '', 'Add new nft', [PROJECT.WRITE]],
	getById: ['GET', '/{id}', 'Get nft by Id', [PROJECT.READ]]
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
