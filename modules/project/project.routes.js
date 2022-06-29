const validators = require('./project.validators');
const controllers = require('./project.controllers');
const {PROJECT, BENEFICIARY, VENDOR} = require('../../constants/permissions');
const {addInstitution} = require('./project.controllers');

const UPLOAD_SIZE_MB = 10;

const routes = {
  list: ['GET', '', 'List all the agencies projects', [PROJECT.READ, PROJECT.ADMIN]],
  add: {
    method: 'POST',
    path: '',
    description: 'Add new project',
    uploadPayload: {
      output: 'stream',
      parse: true,
      multipart: true,
      allow: 'multipart/form-data',
      maxBytes: 1024 * 1024 * UPLOAD_SIZE_MB
    },
    permissions: [PROJECT.READ, PROJECT.ADMIN]
  },
  // add: ['POST', '', 'Add a project', [PROJECT.WRITE, PROJECT.ADMIN]],
  getById: ['GET', '/{id}', 'Get a project by Id', [PROJECT.READ, PROJECT.ADMIN]],
  remove: ['DELETE', '/{id}', 'Remove and archive a project', [PROJECT.REMOVE, PROJECT.ADMIN]],
  update: ['PUT', '/{id}', 'Update project details', [PROJECT.WRITE, PROJECT.ADMIN]],
  uploadAndAddBenfToProject: {
    method: 'POST',
    path: '/{id}/upload-beneficiaries',
    description: 'Upload beneficiaris to the project',
    uploadPayload: {
      output: 'stream',
      parse: true,
      multipart: true,
      allow: 'multipart/form-data',
      maxBytes: 1024 * 1024 * UPLOAD_SIZE_MB
    },
    permissions: [PROJECT.WRITE, PROJECT.ADMIN]
  },
  changeStatus: ['PATCH', '/{id}/status', 'Update project status', [PROJECT.WRITE, PROJECT.ADMIN]],
  addTokenAllocation: [
    'PATCH',
    '/{id}/token',
    'Add token allocation to the project',
    [PROJECT.WRITE, PROJECT.ADMIN]
  ],
  addBeneficiary: [
    'POST',
    '/{id}/beneficiaries',
    'Add beneficiary to the project',
    [BENEFICIARY.WRITE, BENEFICIARY.ADMIN]
  ],
  listBeneficiaries: [
    'GET',
    '/{id}/beneficiaries',
    'List beneficiaries registered to the project',
    [BENEFICIARY.READ, BENEFICIARY.ADMIN]
  ],
  listVendors: [
    'GET',
    '/{id}/vendors',
    'List vendors registered to the project',
    [VENDOR.READ, VENDOR.ADMIN]
  ],
  generateAidConnectId: ['GET', '/{id}/aid-connect', 'generate / Get the aid-connect id'],
  changeAidConnectStatus: ['PATCH', '/{id}/aid-connect/status', 'change aid-connect status'],
  addCampaignFundRaiser: {
    method: 'POST',
    path: '/{id}/addCampaign',
    description: 'Add Campaign Fundraiser',
    permissions: [PROJECT.READ, PROJECT.ADMIN]
  },
  token: ['POST', '/{id}/token', 'generate token', [PROJECT.READ, PROJECT.ADMIN]],
  addInstitution: [
    'POST',
    '/{id}/institutions',
    'Add institution to the project',
    [PROJECT.READ, PROJECT.ADMIN]
  ],
  getInstitution: ['GET', '/{id}/institutions', 'Get institution', [PROJECT.READ, PROJECT.ADMIN]]
};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
  app.register({
    name: 'projects',
    routes,
    validators,
    controllers
  });
}

module.exports = register;
