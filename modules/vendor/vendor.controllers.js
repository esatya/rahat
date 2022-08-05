const ethers = require('ethers');
const {Types} = require('mongoose');
const {addFileToIpfs, isIpfsHash} = require('../../helpers/utils/ipfs');
const Logger = require('../../helpers/logger');
const {DataUtils} = require('../../helpers/utils');
const {VendorModel, ProjectModel} = require('../models');
const {Notification} = require('../notification/notification.controller');
const {TokenRedemption} = require('./vendorTokenRedemption.model');
const {VendorConstants} = require('../../constants');
const {Agency} = require('../agency/agency.controllers');
const User = require('../user/user.controllers');

const {tokenTransaction, nftTransaction} = require('../../helpers/blockchain/transactionLogs');
const tokenRedemptionModel = require('./vendorTokenRedemption.model');
const vendorTokenChargeModel = require('./vendorTokenCharge.model');
const vendorTokenRedeemModel = require('./vendorTokenRedemption.model');
const CONSTANT = require('../../constants');

const {ObjectId} = Types;

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
    try {
      payload.agencies = [{agency: agencyId}];

      if (!isIpfsHash(payload.photo)) {
        const ipfsPhotoHash = await this.uploadToIpfs(this.decodeBase64Image(payload.photo).data);
        payload.photo = ipfsPhotoHash;
      }
      if (!isIpfsHash(payload.govt_id_image)) {
        const ipfsIdHash = await this.uploadToIpfs(
          this.decodeBase64Image(payload.govt_id_image).data
        );
        payload.govt_id_image = ipfsIdHash;
      }
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
    } catch (e) {
      console.log(e);
      throw Error(e);
    }
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
  async countVendorViaProject() {
    const $match = {is_archived: false};
    const query = [
      {$match},
      {
        $lookup: {
          from: 'projects',
          localField: 'projects',
          foreignField: '_id',
          as: 'projectData'
        }
      },
      {
        $unwind: '$projectData'
      },
      {
        $group: {
          _id: '$projectData._id',
          name: {$first: '$projectData.name'},
          count: {$sum: 1}
        }
      }
    ];
    const totalCount = await VendorModel.find($match).countDocuments();
    const project = await VendorModel.aggregate(query);
    const unknownCount = totalCount - project.reduce((prev, curr) => prev + curr.count, 0);
    project.push({name: 'UnApproved', count: unknownCount});
    return {totalCount, project};
  },

  async getTransactions(id, tokenAddress, rahatAddress) {
    const vendor = await this.getbyId(id);
    const transactions = await tokenTransaction(tokenAddress, rahatAddress, vendor.wallet_address);
    return transactions;
  },

  async getNftTransactions(id, nftAddress, rahatAddress) {
    const vendor = await this.getbyId(id);
    const transactions = await nftTransaction(nftAddress, rahatAddress, vendor.wallet_address);
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
  },
  async getProjectNames (data){
    const projectsInvolved = [];
    for (var i =0; i<data.projects.length; i++){
      projects = data.projects[i];
      projectsInvolved.push( await this.fetchProjectNameById(projects));
    }
    return projectsInvolved;
  },
  async fetchProjectNameById(projectId){
  const {name, allocations} = await ProjectModel.findOne({_id: projectId});
  return {name, allocations};
},
  async parseVendorExportReportData(vendorData){
    const vendorExportData = [];
    for (let i=0; i< vendorData.length; i++){
      let data = vendorData[i];
      const projectsInvolved = await this.getProjectNames(data);
      const projectsName = projectsInvolved.map((projects)=>{
        return projects.name;
      });
      const allocations = projectsInvolved.map((projects)=>{
        return projects.allocations.map(allocation =>{return allocation.amount});
      })[0];
      let TotalAllocations =0;
      allocations.map((amount)=>{TotalAllocations =TotalAllocations+amount});
      vendorExportData.push({
        "Name": data.name,
        "Phone": data.phone,
        "Email Address": data.email,
        "Wallet Address": data.wallet_address,
        "Shop Name": data.shop_name,
        "Address": data.address,
        "Gender": data.gender,
        "PAN Number": data.pan_number,
        "Total Balance": TotalAllocations,
        "Projects Involved": projectsName.join(" ,"),
        "Registration Date": data.created_at,
      })

    }
    return vendorExportData;
  },
  async getVendorExportData(from, to, projectId) {
    const dateFilter =
      from && to
        ? {
            created_at: {
              $gt: new Date(from),
              $lt: new Date(to)
            }
          }
        : null;
    const vendorData = projectId
      ? await VendorModel.find({
          projects: [projectId],
          ...dateFilter
        })
      : await VendorModel.find({
          ...dateFilter
        });

    return await this.parseVendorExportReportData(vendorData);
  },
  async getReportingData(query) {
    const vendorByProject = await this.countVendorViaProject();
    const vendorExportData = await this.getVendorExportData(query.from, query.to, query.projectId);
    return {vendorByProject, vendorExportData};
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
      contracts: {rahat_erc20, rahat}
    } = await Agency.getFirst();
    return Vendor.getTransactions(req.params.id, rahat_erc20, rahat);
  },
  getNftTransactions: async req => {
    const {
      contracts: {rahat_erc1155, rahat}
    } = await Agency.getFirst();
    return Vendor.getNftTransactions(req.params.id, rahat_erc1155, rahat);
  },
  addToProjectByvendorId: req => {
    const vendorId = req.params.id;
    const {projectId} = req.payload;
    return Vendor.addToProjectByvendorId(vendorId, projectId);
  },
  addChargeTokenTx: req => Vendor.addChargeTokenTx(req.payload),
  listChargeTx: req => Vendor.listChargeTx(req.params.id),
  addTokenRedeemTx: req => Vendor.addTokenRedeemTx(req.payload),
  listTokenRedeemTx: req => Vendor.listTokenRedeemTx(req.params.id),
  getReportingData: req => Vendor.getReportingData(req)
};
