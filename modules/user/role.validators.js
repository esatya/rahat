const Joi = require('joi');

module.exports = {
  get: {
    params: Joi.object({
      id: Joi.string(),
    }),
  },
};
