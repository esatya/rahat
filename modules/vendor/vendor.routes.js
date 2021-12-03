const validators = require('./vendor.validators');
const controllers = require('./vendor.controllers');
const { VENDOR } = require('../../constants/permissions');

const routes = {
	list: ['GET', '', 'List all vendors.', [VENDOR.READ, VENDOR.ADMIN]],
	add: ['POST', '', 'Add a vendor.', [VENDOR.WRITE, VENDOR.ADMIN]],
	getbyId: ['GET', '/{id}', 'Get an vendor by Wallet Adress or id.'],
	update: ['PUT', '/{id}', 'Update vendor details.', [VENDOR.WRITE, VENDOR.ADMIN]],
	remove: ['DELETE', '/{id}', 'Remove and archive a Vendor,', [VENDOR.REMOVE, VENDOR.ADMIN]],
	approve: [
		'PATCH',
		'/approve',
		'Approves vendor to interact with projects of this agency',
		[VENDOR.WRITE, VENDOR.ADMIN]
	],
	changeStatus: ['PATCH', '/{id}/status', 'Change Vendors Status', [VENDOR.WRITE, VENDOR.ADMIN]],
	register: ['POST', '/register', 'register a vendor.'],
	getTransactions: ['GET', '/{id}/transactions', 'Get the token transactions by current vendor'],
	addToProjectByvendorId: ['POST', '/{id}/add-to-project', 'Add vendor to project', [VENDOR.WRITE, VENDOR.ADMIN]]
};

function register(app) {
	app.register({
		name: 'vendors',
		routes,
		validators,
		controllers
	});
}

module.exports = register;
