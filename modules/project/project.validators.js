const Joi = require('joi');
const {ProjectModel, BeneficiaryModel} = require('../models');

const GooseJoi = require('../../helpers/utils/goosejoi');

const Project = GooseJoi.convert(ProjectModel);
const Beneficiary = GooseJoi.convert(BeneficiaryModel);

module.exports = {
  add: {
    payload: Joi.object({
      name: Project.name,
      file: Joi.any(),
      end_date: Project.end_date,
      project_manager: Project.project_manager,
      location: Project.location,
      description: Joi.string().allow(''),
      financial_institutions: Joi.string()
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
  uploadAndAddBenfToProject: {
    params: GooseJoi.id(),
    payload: Joi.object({
      file: Joi.any()
    })
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
      financial_institutions: Joi.string()
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
  },
  generateAidConnectId: {
    params: GooseJoi.id()
  },

  changeAidConnectStatus: {
    params: GooseJoi.id(),
    payload: Joi.object({
      isActive: Joi.bool()
    })
  },
  addCampaignFundRaiser: {
    params: GooseJoi.id(),
    payload: Joi.object({
      campaignTitle: Joi.string(),
      campaignId: Joi.string()

    })
  },
  token: {
    params: GooseJoi.id(),
    payload: Joi.object({
      email: Joi.string()
    })
  }
};
