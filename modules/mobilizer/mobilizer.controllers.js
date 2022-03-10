const ethers = require('ethers');
const {Types} = require('mongoose');
const {addFileToIpfs} = require('../../helpers/utils/ipfs');
const Logger = require('../../helpers/logger');
const {DataUtils} = require('../../helpers/utils');
const {MobilizerModel} = require('../models');
const {MobilizerConstants} = require('../../constants');
const {Agency} = require('../agency/agency.controllers');
const UserController = require('../user/user.controllers');
const {Notification} = require('../notification/notification.controller');
const CONSTANT = require('../../constants');
const User = require('../user/user.controllers');
const TokenMobilizationModel = require('./tokenMobilization.model');

// const { tokenTransaction } = require('../../helpers/blockchain/tokenTransaction');
// const tokenRedemptionModel = require('./vendorTokenRedemption.model');

const Mobilizer = {
  async add(payload) {
    if (!payload.email) payload.email = `mail-${payload.phone}@rahat.com`;
    payload.agencies = [{agency: payload.currentUser.agency}];
    const ipfsIdHash = await this.uploadToIpfs(this.decodeBase64Image(payload.govt_id_image).data);
    const ipfsPhotoHash = await this.uploadToIpfs(this.decodeBase64Image(payload.photo).data);
    payload.govt_id_image = ipfsIdHash;
    payload.photo = ipfsPhotoHash;
    return MobilizerModel.create(payload);
  },

  async register(agencyId, payload) {
    payload.agencies = [{agency: agencyId}];
    const ipfsIdHash = await this.uploadToIpfs(this.decodeBase64Image(payload.govt_id_image).data);
    const ipfsPhotoHash = await this.uploadToIpfs(this.decodeBase64Image(payload.photo).data);
    payload.govt_id_image = ipfsIdHash;
    payload.photo = ipfsPhotoHash;
    const mobilizer = await MobilizerModel.create(payload);
    await Notification.create({
      type: CONSTANT.NOTIFICATION_TYPES.mobilizer_registered,
      ...mobilizer._doc
    });
    await User.sendMailToAdmin({
      template: CONSTANT.NOTIFICATION_TYPES.mobilizer_registered,
      data: {user_id: mobilizer._id, user_name: mobilizer?.name}
    });

    return mobilizer;
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
  async approve(wallet_address, projectId, currentUser) {
    const {name, email, phone} = await this.getbyWallet(wallet_address);
    const userData = {
      name,
      email,
      phone,
      wallet_address,
      agency: currentUser.agency,
      roles: 'Mobilizer'
    };
    const projects = {project: projectId, status: 'active'};
    await UserController.add({payload: userData});
    return MobilizerModel.findOneAndUpdate(
      {wallet_address, agencies: {$elemMatch: {agency: Types.ObjectId(currentUser.agency)}}},
      {$set: {'agencies.$.status': MobilizerConstants.status.Active}, $addToSet: {projects}},
      {new: true}
    );

    // return MobilizerModel.findOneAndUpdate(
    //   // {wallet_address, agencies: {$elemMatch: {agency: Types.ObjectId(currentUser.agency)}}},
    //   {wallet_address, 'projects.project': {$ne: projectId}},
    //   {$addToSet: {projects: [projectInstance]}},
    //   {new: true}
    // );
  },

  async updateStatusInProject(req) {
    const {params, payload} = req;
    const {status, projectId} = payload;
    const res = await MobilizerModel.findOneAndUpdate(
      {_id: params.id, projects: {$elemMatch: {project: Types.ObjectId(projectId)}}},
      {$set: {'projects.$.status': status}},
      {new: true}
    );
    return res;
  },

  async changeStatus(id, payload, currentUser) {
    const {status} = payload;
    return MobilizerModel.findOneAndUpdate(
      {_id: id, agencies: {$elemMatch: {agency: Types.ObjectId(currentUser.agency)}}},
      {$set: {'agencies.$.status': status}},
      {new: true}
    );
  },

  getbyId(id) {
    return MobilizerModel.findOne({_id: id}).populate('projects.project');
  },

  getbyWallet(wallet_address) {
    return MobilizerModel.findOne({wallet_address}).populate('projects.project');
  },

  list(query, currentUser) {
    const start = query.start || 0;
    const limit = query.limit || 20;
    let $match = {
      is_archived: false,
      agencies: {$elemMatch: {agency: Types.ObjectId(currentUser.agency)}}
    };
    if (query.show_archive) $match.is_archived = true;
    if (query.phone) $match.phone = {$regex: new RegExp(`${query.phone}`), $options: 'i'};
    if (query.name) $match.name = {$regex: new RegExp(`${query.name}`), $options: 'i'};
    if (query.projectId) {
      $match = {
        projects: {
          $elemMatch: {project: Types.ObjectId(query.projectId)}
        }
      };
    }
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
      model: MobilizerModel,
      query: [{$match}]
    });
  },

  async remove(id, curUserId) {
    const ben = await MobilizerModel.findOneAndUpdate(
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

    return MobilizerModel.findOneAndUpdate({_id: id, is_archived: false}, payload, {
      new: true,
      runValidators: true
    });
  },
  countMobilizer(currentUser) {
    const query = {is_archived: false};
    query.agencies = {$elemMatch: {agency: Types.ObjectId(currentUser.agency)}};

    return MobilizerModel.find(query).countDocuments();
  },

  addTokenIssueTx(payload) {
    console.log({payload});
    return TokenMobilizationModel.create(payload);
  },

  listTokenIssueTx(mobilizerId) {
    return TokenMobilizationModel.find({mobilizer_wallet: mobilizerId});
  }

  // async getTransactions(id, tokenAddress) {
  //   const mobilizer = await this.getbyId(id);
  //   const transactions = await tokenTransaction(tokenAddress, mobilizer.wallet_address);
  //   return transactions;
  // },

  // async addTokenRedemption(payload) {
  //   return tokenRedemptionModel.create(payload);
  // },

  // async countVendorTokenRedemption() {
  //   // const query = { vendor_wallet: vendorWallet };
  //   const total = await tokenRedemptionModel.aggregate([
  //     { $group: { _id: '$vendor_wallet', totalSum: { $sum: '$amount' } } },
  //   ]);
  //   const totalToken = total.reduce((acc, obj) => acc + obj.totalSum, 0);
  //   return { totalTokenRedemption: totalToken, tokenRedemption: total };
  // },
};

module.exports = {
  Mobilizer,
  add: req => Mobilizer.add(req.payload),
  getbyId: req => {
    const {id} = req.params;
    if (ethers.utils.isAddress(id)) return Mobilizer.getbyWallet(id, req.currentUser);
    return Mobilizer.getbyId(req.params.id, req.currentUser);
  },
  list: req => Mobilizer.list(req.query, req.currentUser),
  remove: req => Mobilizer.remove(req.params.id, req.currentUserId),
  update: req => Mobilizer.update(req.params.id, req.payload),
  approve: req =>
    Mobilizer.approve(req.payload.wallet_address, req.payload.projectId, req.currentUser),
  changeStatus: req => Mobilizer.changeStatus(req.params.id, req.payload, req.currentUser),
  updateStatusInProject: req => Mobilizer.updateStatusInProject(req),
  register: async req => {
    const {_id: agencyId} = await Agency.getFirst();
    return Mobilizer.register(agencyId, req.payload);
  },
  addTokenIssueTx: req => Mobilizer.addTokenIssueTx(req.payload),
  listTokenIssueTx: req => Mobilizer.listTokenIssueTx(req.params.mobilizerId)
  // getTransactions: async (req) => {
  //   const {
  //     contracts: { token: tokenAddress },
  //   } = await Agency.getFirst();
  //   return Mobilizer.getTransactions(req.params.id, tokenAddress);
  // },
};
