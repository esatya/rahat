const Joi = require('joi');
const { ProjectModel, BeneficiaryModel } = require('../models');

const GooseJoi = require('../../helpers/utils/goosejoi');

const Project = GooseJoi.convert(ProjectModel);
const Beneficiary = GooseJoi.convert(BeneficiaryModel);

module.exports = {
	add: {
		payload: Joi.object({
			name: Project.name,
			end_date: Project.end_date,
			project_manager: Project.project_manager,
			location: Project.location,
			description: Project.description,
			financial_institutions: Project.financial_institutions
		}).label('Project')
	},
	list: {
		query: Joi.object({
			start: Joi.number(),
			limit: Joi.number(),
			name: Joi.string(),
			status: Joi.string()
		})
	},
	changeStatus: {
		params: GooseJoi.id(),
		payload: Joi.object({
			status: Project.status
		})
	},
	getById: {
		params: GooseJoi.id()
	},
	addTokenAllocation: {
		params: GooseJoi.id(),
		payload: Joi.object({
			amount: Joi.number().description('Token amount to allocate to the project'),
			txhash: Joi.string().required().description('Blockchain transaction hash')
		}).description('TokenAllocation')
	},
	remove: {
		params: GooseJoi.id()
	},
	update: {
		params: GooseJoi.id(),
		payload: Joi.object({
			name: Project.name.optional(),
			end_date: Project.end_date,
			project_manager: Project.project_manager,
			location: Project.location,
			description: Project.description,
			financial_institutions: Project.financial_institutions
		}).label('Project')
	},
	listBeneficiaries: {
		params: GooseJoi.id()
	},
	addBeneficiary: {
		params: GooseJoi.id(),
		payload: Joi.object({
			name: Beneficiary.name,
			phone: Beneficiary.phone,
			wallet_address: Beneficiary.wallet_address,
			email: Beneficiary.email,
			address: Beneficiary.address,
			address_temporary: Beneficiary.address_temporary,
			govt_id: Beneficiary.govt_id,
			photo: Beneficiary.photo,
			govt_id_image: Beneficiary.govt_id_image
		}).label('Beneficiary')
	}
};
