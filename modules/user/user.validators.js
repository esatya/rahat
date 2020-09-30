const Joi = require('joi');

module.exports = {
  list: {

  },
  add: {
    payload: Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      password: Joi.string(),
      wallet_address: Joi.string(),
      roles: Joi.array().items(Joi.string()),
    }),
  },
};
