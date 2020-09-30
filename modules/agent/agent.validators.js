const Joi = require('joi');
const {
  AgentModel,
} = require('../../models');

/**
 * Validators for each endpoint.
 */
module.exports = {
  findAll: {
    query: (() => ({
      start: Joi.number().description(
        'The index of the first element to return. 0 is the default start.',
      ),
      limit: Joi.number().description(
        'Number of elements to return from start. All the elements are returned by default',
      ),
    }))(),
  },
  add: {
    payload: (() => ({
      agentName: AgentModel.agentName.required(),
      description: AgentModel.description,
      domainClassifierThreshold: AgentModel.domainClassifierThreshold.required(),
    }))(),
  },
  updateSettings: {
    params: (() => ({
      id: Joi.string()
        .required()
        .description('The id of the agent'),
    }))(),
    payload: (() => Joi.object())(),
  },
  findAllSettings: {
    params: (() => ({
      id: Joi.string()
        .required()
        .description('The id of the agent'),
    }))(),
  },
  findById: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
  },
  updateById: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
    payload: (() => ({
      agentName: AgentModel.agentName,
      description: AgentModel.description,
      status: AgentModel.status,
      lastTraining: AgentModel.lastTraining,
      model: AgentModel.model,
    }))(),
  },
  findDomainsByAgentId: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
    query: () => ({
      start: Joi.number().description(
        'The index of the first element to return. 0 is the default start.',
      ),
      limit: Joi.number().description(
        'Number of elements to return from start. All the elements are returned by default',
      ),
      filter: Joi.string().description(
        'String that will filter values to return only those domains with part of this filter in their names',
      ),
    }()),
  },
  deleteById: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
  },
  findIntentsByAgentId: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
    query: (() => ({
      start: Joi.number().description(
        'The index of the first element to return. 0 is the default start.',
      ),
      limit: Joi.number().description(
        'Number of elements to return from start. All the elements are returned by default',
      ),
      filter: Joi.string().description(
        'String that will filter values to return only those intents with part of this filter in their names',
      ),
    }))(),
  },
  findEntitiesByAgentId: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
    query: (() => ({
      start: Joi.number().description(
        'The index of the first element to return. 0 is the default start.',
      ),
      limit: Joi.number().description(
        'Number of elements to return from start. All the elements are returned by default',
      ),
      filter: Joi.string().description(
        'String that will filter values to return only those entities with part of this filter in their names',
      ),
    }))(),
  },
  train: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
  },

  converse: {
    params: (() => ({
      id: AgentModel.id.required().description('Id of the agent'),
    }))(),
    query: (() => ({
      sessionId: Joi.string()
        .required()
        .description('Id of the session'),
      text: Joi.string()
        .required()
        .description('Text to parse'),
      timezone: Joi.string().description(
        'Timezone for duckling parse. Default UTC',
      ),
    }))(),
  },
};
