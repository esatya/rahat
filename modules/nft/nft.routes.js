const validators = require('./nft.validators');
const controllers = require('./nft.controller');

const routes = {
	listByProject: ['GET', '/{id}/list', 'List nfts by project'],
	add: ['POST', '', 'Add new nft'],
	getById: ['GET', '/{id}', 'Get nft by Id']
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
