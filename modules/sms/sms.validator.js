const Joi = require('joi');

module.exports = {
  sendSmsOnTokenIssue: {
    payload: Joi.object({
      token: Joi.string(),
      phone: Joi.string()
    })
  },

  sendSmsOnPackageIssue: {
    payload: Joi.object({
      packageName: Joi.string(),
      phone: Joi.string()
    })
  }
};
