const validators = require('./agent.validators');
const controllers = require('./agent.controllers');

const routes = {
  findAll: [
    'GET',
    '/agent',
    'Find all instances of the model from the data source',
  ],
  add: [
    'POST',
    '/agent',
    'Create a new instance of the model and persist it into the data source',
  ],
  updateSettings: [
    'PUT',
    '/agent/{id}/settings',
    'Modified the agent settings',
  ],
  findAllSettings: [
    'GET',
    '/agent/{id}/settings',
    'Return all the settings of the agent',
  ],
  findById: [
    'GET',
    '/agent/{id}',
    'Find an agent instance by id from the data source',
  ],
  updateById: [
    'PUT',
    '/agent/{id}',
    'Update attributes of an agent instance and persist it into the data source',
  ],
  findDomainsByAgentId: [
    'GET',
    '/agent/{id}/domain',
    'Find list of domains linked with an agent instance specified by id',
  ],
  deleteById: [
    'DELETE',
    '/agent/{id}',
    'Delete a model instance by id from the datasource',
  ],
  findIntentsInDomainByIdByAgentId: [
    'GET',
    '/agent/{id}/domain/{domainId}/intent',
    'Find list of intents for the given domain and agent',
  ],
  findIntentsByAgentId: [
    'GET',
    '/agent/{id}/intent',
    'Find list of intents linked with a model instance specified by id',
  ],
  findEntitiesByAgentId: [
    'GET',
    '/agent/{id}/entity',
    'Find list of entites linked with a model instance specified by id',
  ],
  findDomainByIdByAgentId: [
    'GET',
    '/agent/{id}/domain/{domainId}',
    'Find a domain by id that belongs to the specified model instance',
  ],
  findByName: [
    'GET',
    '/agent/name/{agentName}',
    'Find a model instance by name from the data source',
  ],
  findIntentByIdInDomainByIdByAgentId: [
    'GET',
    '/agent/{id}/domain/{domainId}/intent/{intentId}',
    'Find an intent by id given a domain and an agent',
  ],
  findIntentScenarioInDomainByIdByAgentId: [
    'GET',
    '/agent/{id}/domain/{domainId}/intent/{intentId}/scenario',
    'Find the scenario related with an intent, for the given domain and agent',
  ],
  train: [
    'GET',
    '/agent/{id}/train',
    'Train the specified agent with the rules of intents/entities',
  ],
  findEntityByIdByAgentId: [
    'GET',
    '/agent/{id}/entity/{entityId}',
    'Find an entity by id that belongs to the specified agent',
  ],
  converse: [
    'GET',
    '/agent/{id}/converse',
    'Converse with an already trained agent',
  ],
  exportContent: [
    'GET',
    '/agent/{id}/export',
    'Download a csv file with agent content (domains, intents, entities...)',
  ],
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
  app.register('agent', routes, validators, controllers);
}

module.exports = register;
