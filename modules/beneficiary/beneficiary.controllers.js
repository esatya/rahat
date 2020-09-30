const ObjectId = require('mongodb').ObjectID;
const app = require('../../app');
const Logger = require('../../helpers/logger');
const { DataUtils } = require('../../helpers/utils');
const { BeneficiaryModel, TokenRedemptionModel, TokenDistributionModel } = require('../models');

const logger = Logger.getInstance();

const Beneficiary = {
  async add(payload) {
    payload.agency = payload.currentUser.agency;
    if (payload.project_id) payload.projects = [payload.project_id];
    return BeneficiaryModel.create(payload);
  },

  addToProject(payload) {
    if (!payload.id) {
      return this.add(payload);
    }
    return BeneficiaryModel.findOneAndUpdate(
      { _id: payload.id },
      { $addToSet: { projects: payload.project_id } },
      { new: 1 },
    );
  },

  getbyId(id) {
    return BeneficiaryModel.findOne({ _id: id, is_archived: false });
  },

  getbyWallet(wallet_address) {
    return BeneficiaryModel.findOne({ wallet_address, is_archived: false });
  },

  list(query, currentUser) {
    const start = query.start || 0;
    const limit = query.limit || 20;

    const $match = { is_archived: false, agency: currentUser.agency };
    if (query.show_archive) $match.is_archived = true;
    if (query.projectId) $match.projects = ObjectId(query.projectId);
    if (query.phone) $match.phone = { $regex: new RegExp(`${query.phone}`), $options: 'i' };
    if (query.name) $match.name = { $regex: new RegExp(`${query.name}`), $options: 'i' };
    $match.agency = currentUser.agency;
    const sort = { };
    if (query.sort === 'address' || query.sort === 'name') sort[query.sort] = 1;
    else sort.created_at = -1;

    return DataUtils.paging({
      start,
      limit,
      sort,
      model: BeneficiaryModel,
      query: [{ $match }],
    });
  },

  async remove(id, curUserId) {
    const ben = await BeneficiaryModel.findOneAndUpdate(
      { _id: id }, { is_archived: true, updated_by: curUserId }, { new: true },
    );
    // TODO blockchain call
    return ben;
  },

  update(id, payload) {
    delete payload.status;
    delete payload.balance;
    delete payload.agency;

    return BeneficiaryModel.findOneAndUpdate(
      { _id: id, is_archived: false }, payload, { new: true, runValidators: true },
    );
  },

  async distributeToken(id, payload) {
    const beneficiary = await this.getbyId(id);
    if (!beneficiary) app.error('Invalid beneficiary ID.', 401);
    return TokenDistributionModel.create(payload);
  },

  async listTokenDistributions(id) {
    return TokenDistributionModel.find({ beneficiary_id: id });
  },

  async redeemToken() {
    // TODO
  },

};

module.exports = {
  Beneficiary,
  add: (req) => Beneficiary.add(req.payload),
  getbyId: (req) => Beneficiary.getbyId(req.params.id),
  list: (req) => Beneficiary.list(req.query, req.currentUser),
  remove: (req) => Beneficiary.remove(req.params.id, req.currentUserId),
  update: (req) => Beneficiary.update(req.params.id, req.payload),
  distributeToken: (req) => Beneficiary.distributeToken(req.params.id, req.payload),
  listTokenDistributions: (req) => Beneficiary.listTokenDistributions(req.params.id),
};
