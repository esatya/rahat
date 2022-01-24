const {Types} = require('mongoose');
const Logger = require('../../helpers/logger');
const {DataUtils} = require('../../helpers/utils');
const {InstitutionModel} = require('../models');

const logger = Logger.getInstance();

const Institution = {
  async add(payload) {
    payload.agency = payload.currentUser.agency;
    const project = await InstitutionModel.create(payload);
    // TODO implement blockchain function using project._id
    return project;
  },

  async changeStatus(id, payload) {
    const {status, updated_by} = payload;
    const project = await InstitutionModel.findOneAndUpdate(
      {_id: id, is_archived: false},
      {status, updated_by},
      {new: true, runValidators: true}
    );
    // TODO implement blockchain function using project._id
    return project;
  },

  getById(id) {
    return InstitutionModel.findOne({_id: id});
  },

  list(query, currentUser) {
    const start = query.start || 0;
    const limit = query.limit || 20;
    let $match = {is_archived: false};
    if (query.show_archive) $match = {};
    $match.agency = currentUser.agency;
    if (query.name) $match.name = {$regex: new RegExp(`${query.name}`), $options: 'i'};
    if (query.phone) $match.phone = {$regex: new RegExp(`${query.phone}`), $options: 'i'};
    return DataUtils.paging({
      start,
      limit,
      sort: {name: 1},
      model: InstitutionModel,
      query: [{$match}]
    });
  },

  async remove(id) {
    // TODO only allow if no activity has happened to the project
    const project = await InstitutionModel.findOneAndUpdate(
      {_id: id},
      {is_archived: true},
      {new: true, runValidators: true}
    );
    // TODO blockchain call
    return project;
  },

  update(id, payload) {
    delete payload.status;
    delete payload.agency;
    return InstitutionModel.findOneAndUpdate({_id: id, is_archived: false}, payload, {
      new: true,
      runValidators: true
    });
  },

  async countInstitution(currentUser) {
    const query = {is_archived: false, agency: Types.ObjectId(currentUser.agency)};
    return InstitutionModel.find(query).countDocuments();
  }
};

module.exports = {
  Institution,
  add: req => Institution.add(req.payload),
  changeStatus: req => Institution.changeStatus(req.params.id, req.payload),
  getById: req => Institution.getById(req.params.id),
  list: req => Institution.list(req.query, req.currentUser),
  remove: req => Institution.remove(req.params.id, req.currentUser),
  update: req => Institution.update(req.params.id, req.payload, req.currentUser)
};
