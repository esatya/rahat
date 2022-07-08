const Joi = require('joi');
const {ProjectModel, BeneficiaryModel, InstitutionModel} = require('../models');

const GooseJoi = require('../../helpers/utils/goosejoi');

const Project = GooseJoi.convert(ProjectModel);
const Beneficiary = GooseJoi.convert(BeneficiaryModel);
const Institution = GooseJoi.convert(InstitutionModel);

module.exports = {
  add: {
    payload: Joi.object({
      name: Project.name,
      file: Joi.any(),
      start_date: Project.start_date,
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
      start_date: Project.start_date,
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

  addInstitution: {
    params: GooseJoi.id(),
    payload: Joi.object({
      institutionId: Joi.string()
    })
  },
  addNewInstitution: {
    params: GooseJoi.id(),
    payload: Joi.object({
      name: Institution.name.example('Himalayan Bank'),
      bisCode: Institution.bisCode.example('HMB'),
      address: Institution.address.example('Kamaladi, Kathmandu'),
      phone: Institution.phone.example('01-4245980'),
      email: Institution.email.example('testinstitute@gmail.com'),
      logoUrl: Institution.logoUrl.example('https://www.google.com/logo.png'),
      account_number: Joi.string().example('0000000000000000000'),
      project: Joi.string().example('123456')
    })
  },
  getInstitution: {
    params: GooseJoi.id()
  }
};
