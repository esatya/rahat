const config = require('config');
const ethers = require('ethers');
const app = require('../../app');
const Logger = require('../../helpers/logger');
const { DataUtils } = require('../../helpers/utils');
const { AgencyModel } = require('../models');
const { Project, Vendor, Beneficiary } = require('../index');

const logger = Logger.getInstance();

const Agency = {
  add(data) {
    data.is_approved = false;
    return AgencyModel.create(data);
  },
  approve(id) {
    return AgencyModel.findOneAndUpdate(
      { _id: id, is_archived: false },
      { is_approved: true }, { new: true },
    );
  },
  async getFirst() {
    const agencies = await AgencyModel.find({});
    if (agencies.length > 0) return agencies[0]; return null;
  },
  async list() {
    return AgencyModel.find({ is_archived: false });
  },
  getById(id) {
    return AgencyModel.findOne({ _id: id, is_archived: false });
  },
  update(id, payload) {
    delete payload.is_approved;
    delete payload.contracts;

    return AgencyModel.findOneAndUpdate(
      { _id: id, is_archived: false }, payload, { new: true, runValidators: true },
    );
  },

  setContracts(id, payload) {
    const {
      rahat, rahat_admin, token, updated_by,
    } = payload;
    return AgencyModel.findOneAndUpdate(
      { _id: id, is_archived: false }, {
        contracts: { rahat, rahat_admin, token },
        updated_by,
      }, { new: true, runValidators: true },
    );
  },

  async getDashboardData(currentUser) {
    const projectCount = await Project.countProject(currentUser);
    const vendorCount = await Vendor.countVendor(currentUser);
    const beneficiary = await Beneficiary.countBeneficiary(currentUser);
    const tokenAllocation = await Project.getTokenAllocated(currentUser);
    return {
      projectCount, vendorCount, beneficiary, tokenAllocation,
    };
  },
};

module.exports = {
  Agency,
  getById: (req) => Agency.getById(req.params.id),
  update: (req) => Agency.update(req.params.id, req.payload),
  setContracts: (req) => Agency.setContracts(req.params.id, req.payload),
  getDashboardData: (req) => Agency.getDashboardData(req.currentUser),
};
