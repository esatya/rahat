const Joi = require('joi');
const { InstitutionModel } = require('../models');

const GooseJoi = require('../../helpers/utils/goosejoi');

const Institution = GooseJoi.convert(InstitutionModel);

module.exports = {
  add: {
    payload: Joi.object({
      name: Institution.name.example('Himalayan Bank'),
      address: Institution.address.example('Kamaladi, Kathmandu'),
      phone: Institution.phone.example('01-4245980'),
    }).label('Institution'),
  },
  changeStatus: {
    params: GooseJoi.id(),
    payload: Joi.object({
      status: Institution.status,
    }),
  },
  getById: {
    params: GooseJoi.id(),
  },
  remove: {
    params: GooseJoi.id(),
  },
  update: {
    params: GooseJoi.id(),
    payload: Joi.object({
      name: Institution.name.optional(),
      address: Institution.address.optional(),
      phone: Institution.phone.optional(),
    }).label('Institution'),
  },
};
