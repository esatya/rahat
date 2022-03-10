const ethers = require('ethers');
const {Types} = require('mongoose');
const {addFileToIpfs} = require('../../helpers/utils/ipfs');
const Logger = require('../../helpers/logger');
const {DataUtils} = require('../../helpers/utils');
const {VendorModel} = require('../models');
const {Notification} = require('../notification/notification.controller');
const {TokenRedemption} = require('./vendorTokenRedemption.model');
const {VendorConstants} = require('../../constants');
const {Agency} = require('../agency/agency.controllers');
const User = require('../user/user.controllers');

const {tokenTransaction} = require('../../helpers/blockchain/tokenTransaction');
const tokenRedemptionModel = require('./vendorTokenRedemption.model');
const vendorTokenChargeModel = require('./vendorTokenCharge.model');
const vendorTokenRedeemModel = require('./vendorTokenRedemption.model');
const CONSTANT = require('../../constants');

const {ObjectId} = Types;

const logger = Logger.getInstance();

const Vendor = {
  async add(payload) {
    try {
      payload.agencies = [{agency: payload.currentUser.agency}];
      const {govt_id_image, photo} = payload;
      if (govt_id_image) {
        const govt_img_hash = await this.uploadToIpfs(this.decodeBase64Image(govt_id_image).data);
        payload.govt_id_image = govt_img_hash;
      }
      if (photo) {
        const ipfsPhotoHash = await this.uploadToIpfs(this.decodeBase64Image(photo).data);
        payload.photo = ipfsPhotoHash;
      }
      if (payload.extra_files)
        payload.extra_files = await this.uploadExtraFiles(payload.extra_files);
      payload.projects = payload.projects ? payload.projects.split(',') : [];

      return VendorModel.create(payload);
    } catch (err) {
      throw Error(err);
    }
  },

  async uploadExtraFiles(extra_files) {
    const result = {};
    const {identity_photo, signature_photo, mou_file} = extra_files;
    if (identity_photo) {
      const decoded = this.decodeBase64Image(identity_photo);
      result.identity_photo = await this.uploadToIpfs(decoded.data);
    }
    if (signature_photo) {
      const decoded = this.decodeBase64Image(signature_photo);
      result.signature_photo = await this.uploadToIpfs(decoded.data);
    }
    if (mou_file) {
      const decoded = this.decodeBase64Image(mou_file);
      result.mou_file = await this.uploadToIpfs(decoded.data);
    }
    return result;
  },

  async register(agencyId, payload) {
    payload.agencies = [{agency: agencyId}];
    const ipfsIdHash = await this.uploadToIpfs(this.decodeBase64Image(payload.govt_id_image).data);
    const ipfsPhotoHash = await this.uploadToIpfs(this.decodeBase64Image(payload.photo).data);
    payload.govt_id_image = ipfsIdHash;
    payload.photo = ipfsPhotoHash;
    const vendor = await VendorModel.create(payload);
    await Notification.create({
      type: CONSTANT.NOTIFICATION_TYPES.vendor_registered,
      ...vendor._doc
    });

    await User.sendMailToAdmin({
      template: CONSTANT.NOTIFICATION_TYPES.vendor_registered,
      data: {user_id: vendor._id, user_name: vendor?.name}
    });

    return vendor;
  },

  decodeBase64Image(dataString) {
    if (!dataString) return {type: null, data: null};
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const response = {};
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
    return response;
  },
  async uploadToIpfs(file) {
    if (!file) return '';
    const ipfsHash = await addFileToIpfs(file);
    return ipfsHash.cid.toString();
  },

  // Approve after event from Blockchain
  async approve(wallet_address, currentUser) {
    return VendorModel.findOneAndUpdate(
      {wallet_address, agencies: {$elemMatch: {agency: Types.ObjectId(currentUser.agency)}}},
      {$set: {'agencies.$.status': VendorConstants.status.Active}},
      {new: true}
    );
  },
  async changeStatus(id, payload, currentUser) {
    const {status} = payload;
    return VendorModel.findOneAndUpdate(
      {_id: id, agencies: {$elemMatch: {agency: Types.ObjectId(currentUser.agency)}}},
      {$set: {'agencies.$.status': status}},
      {new: true}
    );
  },

  getbyId(id, currentUser) {
    return VendorModel.findOne({_id: id}).populate('projects');
  },

  addToProjectByvendorId(vendorId, projectId) {
    return VendorModel.findOneAndUpdate(
      {_id: vendorId},
      {$addToSet: {projects: projectId}},
      {new: 1}
    );
  },

  getbyWallet(wallet_address, currentUser) {
    return VendorModel.findOne({wallet_address});
  },

  list(query, currentUser) {
    const start = query.start || 0;
    const limit = query.limit || 10;
    let $match = {
      is_archived: false,
      agencies: {$elemMatch: {agency: Types.ObjectId(currentUser.agency)}}
    };
    if (query.show_archive) $match.is_archived = true;
    if (query.phone) $match.phone = {$regex: new RegExp(`${query.phone}`), $options: 'i'};
    if (query.name) $match.name = {$regex: new RegExp(`${query.name}`), $options: 'i'};
    if (query.projectId) $match.projects = {$in: [ObjectId(query.projectId)]};
    if (query.status) {
      $match = {
        agencies: {
          $elemMatch: {agency: Types.ObjectId(currentUser.agency), status: query.status}
        }
      };
    }

    const sort = {};
    if (query.sort === 'address' || query.sort === 'name') sort[query.sort] = 1;
    else sort.created_at = -1;

    return DataUtils.paging({
      start,
      limit,
      sort,
      model: VendorModel,
      query: [{$match}]
    });
  },

  async remove(id, curUserId) {
    const ben = await VendorModel.findOneAndUpdate(
      {_id: id},
      {is_archived: true, updated_by: curUserId},
      {new: true}
    );
    // TODO blockchain call
    return ben;
  },

  update(id, payload) {
    delete payload.status;
    delete payload.balance;
    delete payload.agency;

    return VendorModel.findOneAndUpdate({_id: id, is_archived: false}, payload, {
      new: true,
      runValidators: true
    });
  },
  countVendor(currentUser) {
    const query = {is_archived: false};
    query.agencies = {$elemMatch: {agency: Types.ObjectId(currentUser.agency)}};

    return VendorModel.find(query).countDocuments();
  },

  async getTransactions(id, tokenAddress) {
    const vendor = await this.getbyId(id);
    const transactions = await tokenTransaction(tokenAddress, vendor.wallet_address);
    return transactions;
  },

  async addTokenRedemption(payload) {
    return tokenRedemptionModel.create(payload);
  },

  async countVendorTokenRedemption() {
    // const query = { vendor_wallet: vendorWallet };
    const total = await tokenRedemptionModel.aggregate([
      {$group: {_id: '$vendor_wallet', totalSum: {$sum: '$amount'}}}
    ]);
    const totalToken = total.reduce((acc, obj) => acc + obj.totalSum, 0);
    return {totalTokenRedemption: totalToken, tokenRedemption: total};
  },

  async addChargeTokenTx(payload) {
    return vendorTokenChargeModel.create(payload);
  },

  async listChargeTx(id) {
    return vendorTokenChargeModel.find({vendor_id: id});
  },

  async addTokenRedeemTx(payload) {
    return vendorTokenRedeemModel.create(payload);
  },

  async listTokenRedeemTx(id) {
    return vendorTokenRedeemModel.find({vendor_wallet: id});
  }
};

module.exports = {
  Vendor,
  add: req => Vendor.add(req.payload),
  getbyId: req => {
    const {id} = req.params;
    if (ethers.utils.isAddress(id)) return Vendor.getbyWallet(id, req.currentUser);
    return Vendor.getbyId(req.params.id, req.currentUser);
  },
  list: req => Vendor.list(req.query, req.currentUser),
  remove: req => Vendor.remove(req.params.id, req.currentUserId),
  update: req => Vendor.update(req.params.id, req.payload),
  approve: req => Vendor.approve(req.payload.wallet_address, req.currentUser),
  changeStatus: req => Vendor.changeStatus(req.params.id, req.payload, req.currentUser),
  register: async req => {
    const {_id: agencyId} = await Agency.getFirst();
    return Vendor.register(agencyId, req.payload);
  },
  getTransactions: async req => {
    const {
      contracts: {token: tokenAddress}
    } = await Agency.getFirst();
    return Vendor.getTransactions(req.params.id, tokenAddress);
  },
  addToProjectByvendorId: req => {
    const vendorId = req.params.id;
    const {projectId} = req.payload;
    return Vendor.addToProjectByvendorId(vendorId, projectId);
  },
  addChargeTokenTx: req => Vendor.addChargeTokenTx(req.payload),
  listChargeTx: req => Vendor.listChargeTx(req.params.id),
  addTokenRedeemTx: req => Vendor.addTokenRedeemTx(req.payload),
  listTokenRedeemTx: req => Vendor.listTokenRedeemTx(req.params.id)
};
