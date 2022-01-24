const Joi = require('joi');
const TxModel = require('./transaction.model');

const GooseJoi = require('../../helpers/utils/goosejoi');

const tx = GooseJoi.convert(TxModel);

/**
 * Validators for each endpoint.
 * payload, query, params
 */
module.exports = {
  add: {
    payload: Joi.object({
      title: tx.title,
      details: tx.details,
      to: tx.to,
      gas: tx.gas,
      data: tx.data
    })
  },
  list: {
    params: Joi.object({
      to: Joi.string()
    })
  }
};
