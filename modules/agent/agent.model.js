const Joi = require('joi');

/**
 * Agent model
 */
module.exports = {
  id: Joi.number(),
  agentName: Joi.string().trim(),
  description: Joi.string().trim(),
  useWebhook: Joi.boolean(),
  usePostFormat: Joi.boolean(),
  domainClassifierThreshold: Joi.number(),
  fallbackResponses: Joi.array().items(Joi.string().trim()),
  status: Joi.string().trim(),
  lastTraining: Joi.date(),
  extraTrainingData: Joi.boolean(),
  enableModelsPerDomain: Joi.boolean(),
  model: Joi.string(),
  settings: Joi.object(),
};
