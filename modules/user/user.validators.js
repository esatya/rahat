const Joi = require('joi');
const GooseJoi = require('../../helpers/utils/goosejoi');

module.exports = {
  list: {
    query: Joi.object({
      name: Joi.string(),
      start: Joi.number(),
      limit: Joi.number(),
      hideMobilizers: Joi.bool()
    })
  },
  add: {
    payload: Joi.object({
      name: Joi.string(),
      email: Joi.string().optional(),
      phone: Joi.string(),
      wallet_address: Joi.string(),
      agency: Joi.string(),
      roles: Joi.array().items(Joi.string())
    })
  },

  register: {
    payload: Joi.object({
      name: Joi.string(),
      email: Joi.string().optional(),
      phone: Joi.string(),
      wallet_address: Joi.string(),
      agency: Joi.string()
    })
  },
  findById: {
    params: GooseJoi.id()
  },

  listByRole: {
    params: Joi.any()
  },

  addRoles: {
    params: GooseJoi.id(),
    payload: Joi.object({
      roles: Joi.array()
    })
  },

  update: {
    params: GooseJoi.id(),
    payload: Joi.object({
      name: Joi.string().optional(),
      email: Joi.string().optional(),
      phone: Joi.string().optional()
    })
  },

  removeRole: {
    params: GooseJoi.id(),
    payload: Joi.object({
      role: Joi.string()
    })
  },

  checkUser: {
    payload: Joi.object({
      email: Joi.string().optional(),
      phone: Joi.string(),
      wallet_address: Joi.string()
    })
  },

  checkEmail: {
    payload: Joi.object({
      email: Joi.string().required()
    })
  },
  token: {
    query: Joi.object({
      email: Joi.string()
    })
  }
};
