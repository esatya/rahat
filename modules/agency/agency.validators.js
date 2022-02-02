const Joi = require('joi');
const AgencyModel = require('./agency.model');
const GooseJoi = require('../../helpers/utils/goosejoi');

const agency = GooseJoi.convert(AgencyModel);

module.exports = {
  getById: GooseJoi.params({
    id: agency.id.description('Id of the agency')
  }),

  setContracts: {
    params: Joi.object({
      id: agency.id.description('Id of the agency')
    }),
    payload: Joi.object({
      rahat: Joi.string().required(),
      rahat_admin: Joi.string().required(),
      token: Joi.string().required()
    })
  },

  update: {
    params: Joi.object({
      id: agency.id.description('Id of the agency')
    }),
    payload: Joi.object({
      name: Joi.string().optional(),
      email: Joi.string().optional().email(),
      address: Joi.string().optional(),
      phone: Joi.string().optional()
    }).label('Agency')
  }
};
