const ethers = require('ethers');
const { ObjectId, Types } = require('mongoose');
const app = require('../../app');
const Logger = require('../../helpers/logger');
const { DataUtils } = require('../../helpers/utils');
const { VendorModel } = require('../models');
const { VendorConstants } = require('../../constants');
const { Agency } = require('../agency/agency.controllers');

const logger = Logger.getInstance();

const Vendor = {
  add(payload) {
    payload.agencies = [{ agency: payload.currentUser.agency }];
    return VendorModel.create(payload);
  },

  register(agencyId, payload) {
    payload.agencies = [{ agency: agencyId }];
    return VendorModel.create(payload);
  },

  // Approve after event from Blockchain
  async approve(wallet_address, currentUser) {
    return VendorModel.findOneAndUpdate(
      { wallet_address, agencies: { $elemMatch: { agency: Types.ObjectId(currentUser.agency) } } },
      { $set: { 'agencies.$.status': VendorConstants.status.Active } },
      { new: true },
    );
  },
  async changeStatus(id, payload, currentUser) {
    const { status } = payload;
    return VendorModel.findOneAndUpdate(
      { _id: id, agencies: { $elemMatch: { agency: Types.ObjectId(currentUser.agency) } } },
      { $set: { 'agencies.$.status': status } },
      { new: true },
    );
  },

  getbyId(id, currentUser) {
    return VendorModel.findOne({ _id: id });
  },

  getbyWallet(wallet_address, currentUser) {
    return VendorModel.findOne({ wallet_address });
  },

  list(query, currentUser) {
    const start = query.start || 0;
    const limit = query.limit || 20;
    const $match = {
      is_archived: false,
      agencies: { $elemMatch: { agency: Types.ObjectId(currentUser.agency) } },
    };
    if (query.show_archive) $match.is_archived = true;
    if (query.phone) $match.phone = { $regex: new RegExp(`${query.phone}`), $options: 'i' };
    if (query.name) $match.name = { $regex: new RegExp(`${query.name}`), $options: 'i' };

    const sort = { };
    if (query.sort === 'address' || query.sort === 'name') sort[query.sort] = 1;
    else sort.created_at = -1;

    return DataUtils.paging({
      start,
      limit,
      sort,
      model: VendorModel,
      query: [{ $match }],
    });
  },

  async remove(id, curUserId) {
    const ben = await VendorModel.findOneAndUpdate(
      { _id: id }, { is_archived: true, updated_by: curUserId }, { new: true },
    );
    // TODO blockchain call
    return ben;
  },

  update(id, payload) {
    delete payload.status;
    delete payload.balance;
    delete payload.agency;

    return VendorModel.findOneAndUpdate(
      { _id: id, is_archived: false }, payload, { new: true, runValidators: true },
    );
  },
  countVendor(currentUser) {
    const query = { is_archived: false };
    query.agencies = { $elemMatch: { agency: Types.ObjectId(currentUser.agency) } };

    return VendorModel.find(query).countDocuments();
  },
};

module.exports = {
  Agency,
  Vendor,
  add: (req) => Vendor.add(req.payload),
  getbyId: (req) => {
    const { id } = req.params;
    if (ethers.utils.isAddress(id)) return Vendor.getbyWallet(id, req.currentUser);
    return Vendor.getbyId(req.params.id, req.currentUser);
  },
  list: (req) => Vendor.list(req.query, req.currentUser),
  remove: (req) => Vendor.remove(req.params.id, req.currentUserId),
  update: (req) => Vendor.update(req.params.id, req.payload),
  approve: (req) => Vendor.approve(req.payload.wallet_address, req.currentUser),
  changeStatus: (req) => Vendor.changeStatus(req.params.id, req.payload, req.currentUser),
  register: async (req) => {
    const { _id: agencyId } = await Agency.getFirst();
    return Vendor.register(agencyId, req.payload);
  },
};
