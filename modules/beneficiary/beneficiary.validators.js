const Joi = require('joi');
const { TokenDistributionModel } = require('../models');
const GooseJoi = require('../../helpers/utils/goosejoi');

const TokenDistribution = GooseJoi.convert(TokenDistributionModel);

module.exports = {
	add: {
		payload: Joi.object({
			name: Joi.string().example('Ram Nepali'),
			phone: Joi.string().example('787878'),
			wallet_address: Joi.string().allow('').optional().example('0x00'),
			email: Joi.string().allow('').optional().example('nepali@gamil.com'),
			address: Joi.string().allow('').optional().example('kathmandu'),
			address_temporary: Joi.string().allow('').optional().example('dang'),
			gender: Joi.string().allow('').optional(),
			govt_id: Joi.string().allow('').optional().example('9799'),
			govt_id_image: Joi.string().allow('').optional().example('http://source'),
			photo: Joi.string().allow('').optional().example('http://source'),
			project_id: Joi.string().allow('').optional().example('5f6b2f815685931cbfe4dad8'),
			extras: Joi.object().optional()
		}).label('Beneficiary')
	},
	getbyId: {
		params: GooseJoi.id()
	},
	remove: {
		params: GooseJoi.id()
	},
	update: {
		params: GooseJoi.id(),
		payload: Joi.object({
			name: Joi.string().optional().example('Ram Nepali'),
			phone: Joi.string().optional().example('787878'),
			wallet_address: Joi.string().allow('').optional().example('0x00'),
			email: Joi.string().allow('').optional().example('nepali@gamil.com'),
			address: Joi.string().allow('').optional().example('kathmandu'),
			address_temporary: Joi.string().allow('').optional().example('dang'),
			gender: Joi.string().allow('').optional(),
			govt_id: Joi.string().allow('').optional().example('9799'),
			govt_id_image: Joi.string().allow('').optional().example('http://source'),
			photo: Joi.string().allow('').optional().example('http://source'),
			project_id: Joi.string().allow('').optional().example('5f6b2f815685931cbfe4dad8'),
			extras: Joi.object().optional()
		}).label('Beneficiary')
	},
	listTokenDistributions: {
		params: GooseJoi.id()
	},
	distributeToken: {
		params: GooseJoi.id(),
		payload: Joi.object({
			beneficiary_id: Joi.string().required().description('Beneficiary ID'),
			project_id: Joi.string().required().description('Project ID'),
			amount: TokenDistribution.amount,
			txhash: TokenDistribution.txhash
		}).label('TokenDistribution')
	}
};
