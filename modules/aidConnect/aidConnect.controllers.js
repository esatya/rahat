const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const {DataUtils} = require('../../helpers/utils');
const {AidConnectModel} = require('../models');
const {Project} = require('../project/project.controllers');
const {addFileToIpfs} = require('../../helpers/utils/ipfs');

const isObjectId = mongoose.Types.ObjectId;

const AidConnect = {
  async checkId(aidConnectId) {
    const project = await Project.getByAidConnectId(aidConnectId);
    if (!project) return {data: false, message: 'Invalid aid-connect Link'};
    const data = {...project.aid_connect, projectName: project.name, projectId: project._id};
    return {data};
  },

  async add(payload) {
    const ben = await AidConnectModel.create(payload);
    // TODO implement blockchain function using project._id
    return ben;
  },

  async addMany(aidConnectId, payload) {
    const validAidConnectId = await this.checkId(aidConnectId);
    if (!validAidConnectId || !validAidConnectId.data) return validAidConnectId;
    try {
      const aidConnectData = payload.map(el => {
        el.aid_connect_id = aidConnectId;
        return el;
      });
      const data = await AidConnectModel.insertMany(aidConnectData, {ordered: true});
      console.log({data});
      const inserted = {
        total: data.length,
        data
      };
      return {inserted};
    } catch (e) {
      console.log(e);
      if (e.writeErrors) {
        const inserted = {
          total: e.result.result.nInserted,
          data: e.insertedDocs
        };
        const failed = {
          total: e.writeErrors.length,
          data: e.writeErrors
        };
        return {inserted, failed};
      }
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

  async getbyId(aidConnectId, id) {
    const validAidConnectId = await this.checkId(aidConnectId);
    if (!validAidConnectId || !validAidConnectId.data) return validAidConnectId;
    let ben;
    if (isObjectId.isValid(id)) {
      ben = await AidConnectModel.findOne({_id: id, is_archived: false}).populate('project');
      if (!ben) {
        return false;
      }
      return ben;
    }
    ben = await AidConnectModel.findOne({phone: id, is_archived: false});
    if (!ben) {
      return false;
    }

    return ben;
  },

  async list(aidConnectId, query) {
    const validAidConnectId = await this.checkId(aidConnectId);
    if (!validAidConnectId || !validAidConnectId.data) return validAidConnectId;
    const start = query.start || 0;
    const limit = query.limit || 10;
    const $match = {is_archived: false, aid_connect_id: aidConnectId};
    if (query.show_archive) $match.is_archived = true;
    if (query.phone) $match.phone = {$regex: new RegExp(`${query.phone}`), $options: 'i'};
    if (query.name) $match.name = {$regex: new RegExp(`${query.name}`), $options: 'i'};
    const sort = {};
    if (query.sort === 'address' || query.sort === 'name') sort[query.sort] = 1;
    else sort.created_at = -1;

    return DataUtils.paging({
      start,
      limit,
      sort,
      model: AidConnectModel,
      query: [{$match}]
    });
  },

  async remove(id) {
    const ben = await AidConnectModel.findOneAndUpdate({_id: id}, {is_archived: true}, {new: true});
    // TODO blockchain call
    return ben;
  },

  async update(id, payload) {
    delete payload.status;
    delete payload.balance;
    if (payload.project) payload.project = payload.project.split(',');

    // if (payload.govt_id_image) {
    // 	const decoded = await this.decodeBase64Image(payload.govt_id_image);
    // 	if (decoded.data) {
    // 		const ipfsIdHash = await this.uploadToIpfs(decoded.data);
    // 		payload.govt_id_image = ipfsIdHash;
    // 	}
    // }
    // if (payload.photo) {
    // 	const decoded = await this.decodeBase64Image(payload.photo);
    // 	if (decoded.data) {
    // 		const ipfsPhotoHash = await this.uploadToIpfs(decoded.data);
    // 		payload.photo = ipfsPhotoHash;
    // 	}
    // }

    return AidConnectModel.findOneAndUpdate({_id: id, is_archived: false}, payload, {
      new: true,
      runValidators: true
    });
  }
};

module.exports = {
  AidConnect,
  add: req => AidConnect.add(req.payload),
  addMany: req => AidConnect.addMany(req.params.aidConnectId, req.payload),
  getbyId: req => AidConnect.getbyId(req.params.aidConnectId, req.params.id),
  list: req => AidConnect.list(req.params.aidConnectId, req.query),
  remove: req => AidConnect.remove(req.params.id),
  update: req => AidConnect.update(req.params.id, req.payload),
  checkId: req => AidConnect.checkId(req.params.aidConnectId)
};
