const Joi = require('joi');

module.exports = {
  get: {
    params: Joi.object({
      id: Joi.string()
    })
  },

  addPermissions: {
    params: Joi.object({
      id: Joi.string()
    }),
    payload: Joi.object({
      permissions: Joi.array()
    })
  }
};
