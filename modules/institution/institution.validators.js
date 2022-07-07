const Joi = require('joi');
const {InstitutionModel} = require('../models');

const GooseJoi = require('../../helpers/utils/goosejoi');

const Institution = GooseJoi.convert(InstitutionModel);

module.exports = {
  add: {
    payload: Joi.object({
      name: Institution.name.example('Himalayan Bank'),
      project: Joi.string().example('Project ID'),
      account_number: Institution.account_number.example('021000021'),
      bisCode: Institution.bisCode.example('HMB'),
      address: Institution.address.example('Kamaladi, Kathmandu'),
      phone: Institution.phone.example('01-4245980'),
      email: Institution.email.example('testinstitute@gmail.com'),
      logoUrl: Institution.logoUrl.example('https://www.google.com/logo.png')
    }).label('Institution')
  },
  changeStatus: {
    params: GooseJoi.id(),
    payload: Joi.object({
      status: Institution.status
    })
  },
  getById: {
    params: GooseJoi.id()
  },
  remove: {
    params: GooseJoi.id()
  },
  update: {
    params: GooseJoi.id(),
    payload: Joi.object({
      name: Institution.name.optional(),
      address: Institution.address.optional(),
      phone: Institution.phone.optional()
    }).label('Institution')
  }
};
