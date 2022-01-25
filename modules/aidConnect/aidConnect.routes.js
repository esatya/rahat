const validators = require('./aidConnect.validators');
const controllers = require('./aidConnect.controllers');

const routes = {
	list: ['GET', '', 'List all beneficiarys.'],
	add: ['POST', '', 'Add a beneficiary.'],
	addMany: ['POST', '/bulk', 'Add a beneficiary in bulk'],
	getbyId: ['GET', '/{id}', 'Get an beneficiary by Phone , id.'],
	update: ['PUT', '/{id}', 'Update beneficiary details.'],
	remove: ['DELETE', '/{id}', 'Remove and archive a beneficiary,']
};

function register(app) {
	app.register({
		name: 'aid-connect',
		routes,
		validators,
		controllers
	});
}

module.exports = register;
