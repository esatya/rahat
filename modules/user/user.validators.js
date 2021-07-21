const Joi = require('joi');

module.exports = {
  list: {

    query: Joi.object({
      // name: Joi.string(),
      start: Joi.number(),
      limit: Joi.number(),
    }),
  },
  add: {
    payload: Joi.object({
      name: Joi.string(),
      email: Joi.string().optional(),
      phone: Joi.string(),
      wallet_address: Joi.string(),
      agency: Joi.string(),
      roles: Joi.array().items(Joi.string()),
    }),
  },

  checkUser: {
    payload: Joi.object({
      email: Joi.string().optional(),
      phone: Joi.string(),
      wallet_address: Joi.string(),
    }),
  },
};
