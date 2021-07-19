const Joi = require('joi');

module.exports = {
  list: {

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
};
