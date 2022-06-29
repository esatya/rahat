const jsonwebtoken = require('jsonwebtoken');
const {Types} = require('mongoose');
const {nanoid} = require('nanoid');
const config = require('config');
const {DataUtils} = require('../../helpers/utils');
const {ProjectModel, InstitutionModel} = require('../models');
const {Beneficiary} = require('../beneficiary/beneficiary.controllers');
const {Vendor} = require('../vendor/vendor.controllers');
const {readExcelFile, removeFile, uploadFile} = require('../../helpers/utils/fileManager');
const {getByWalletAddress} = require('../user/user.controllers');
const {addFileToIpfs} = require('../../helpers/utils/ipfs');

const aidConnectBaseURL = config.get('app.aid-connect-url');

const Project = {
  // TODO: implement blockchain function using project._id
  async add(payload) {
    try {
      let uploaded_beneficiaries = 0;
      const {file, currentUser} = payload;
      payload.agency = currentUser.agency;
      payload.financial_institutions = payload.financial_institutions
        ? payload.financial_institutions.split(',')
        : [];
      const projecCount = await ProjectModel.countDocuments();
      payload.serial_index = projecCount + 1;
      const project = await ProjectModel.create(payload);
      if (file) {
        const uploaded = await uploadFile(file);
        const rows = await readExcelFile(uploaded.file);
        if (rows.length) {
          await removeFile(uploaded.file);
          uploaded_beneficiaries = await this.addBeneficiariesToProject(
            rows,
            project._id,
            currentUser
          );
        }
      }
      return {project, uploaded_beneficiaries};
    } catch (err) {
      throw Error(err);
    }
  },

  async addBeneficiariesToProject(rows, projectId, currentUser) {
    // SKIP HEADER
    let upload_counter = 0;
    rows.shift();
    for (const r of rows) {
      const payload = {
        name: r[0],
        address_temporary: r[1],
        address: r[2],
        phone: r[3],
        govt_id: r[4]
      };
      // payload.project_id = projectId;
      payload.projects = projectId;
      payload.currentUser = currentUser;
      const {name, phone} = payload;
      if (name && phone) {
        await Beneficiary.add(payload);
        upload_counter++;
      }
    }
    return upload_counter;
  },

  async uploadAndAddBenfToProject(projectId, payload) {
    let uploaded_beneficiaries = 0;
    const {file, currentUser} = payload;
    const uploaded = await uploadFile(file);
    const rows = await readExcelFile(uploaded.file);
    if (rows.length) {
      await removeFile(uploaded.file);
      uploaded_beneficiaries = await this.addBeneficiariesToProject(rows, projectId, currentUser);
    }
    return {uploaded_beneficiaries};
  },

  async changeStatus(id, payload) {
    const {status, updated_by} = payload;
    let project = await ProjectModel.findOneAndUpdate(
      {_id: id, is_archived: false},
      {status, updated_by},
      {new: true, runValidators: true}
    );
    if (project && project.project_manager) {
      project = await this.appendProjectManager(project, project.project_manager);
    }
    // TODO implement blockchain function using project._id
    return project;
  },

  async appendProjectManager(doc, project_manager) {
    const existing_doc = doc.toObject();
    const user = await getByWalletAddress(project_manager);
    existing_doc.project_manager = user || null;
    return existing_doc;
  },

  async getById(id) {
    let doc = await ProjectModel.findOne({_id: id});
    if (doc && doc.project_manager) {
      doc = await this.appendProjectManager(doc, doc.project_manager);
    }
    return doc;
  },

  async addTokenAllocation(id, payload) {
    const allocationId = Types.ObjectId();
    const {amount, txhash, updated_by} = payload;
    const allocations = {
      _id: allocationId,
      amount,
      txhash
    };
    await ProjectModel.findOneAndUpdate(
      {_id: id},
      {
        $addToSet: {allocations},
        updated_by
      },
      {new: true, runValidators: true}
    );
    return allocations;
  },

  async confirmTokenAllocation(allocationId, txhash) {
    return ProjectModel.findOneAndUpdate(
      {'allocations._id': Types.ObjectId(allocationId)},
      {
        $set: {
          'allocations.$.txhash': txhash,
          'allocations.$.success': true
        }
      },
      {new: true}
    );
  },

  async addProjectManageDetails(projects) {
    const appended_result = [];
    for (const p of projects) {
      if (p.project_manager) {
        const user = await getByWalletAddress(p.project_manager);
        if (user) p.project_manager = user;
        else p.project_manager = null;
        appended_result.push(p);
      } else {
        appended_result.push(p);
      }
    }
    return appended_result;
  },

  async addCampaignFundRaiser(id, currentUser, payload) {
    const {campaignTitle, campaignId} = payload;
    const project = await ProjectModel.findOneAndUpdate(
      {_id: id},
      {campaignId, campaignTitle},
      {new: true, runValidators: true}
    );
    return project;
  },
  async token(currentUser, payload) {
    const campaignUser = payload.email;
    const jwtDuration = config.get('jwt.duration');
    const appSecret = config.get('app.secret');
    const jwtToken = jsonwebtoken.sign({email: campaignUser}, appSecret, {expiresIn: jwtDuration});
    return jwtToken;
  },

  async list(query, currentUser) {
    const start = query.start || 0;
    const limit = query.limit || 10;

    let $match = {is_archived: false};
    if (query.show_archive) $match = {};
    $match.agency = currentUser.agency;
    if (query.name) $match.name = {$regex: new RegExp(`${query.name}`), $options: 'i'};
    if (query.status) $match.status = query.status;

    const result = await DataUtils.paging({
      start,
      limit,
      sort: {created_at: -1},
      model: ProjectModel,
      query: [{$match}]
    });

    if (result && result.data.length) {
      const appended = await this.addProjectManageDetails(result.data);
      result.data = appended;
    }
    return result;
  },

  async remove(id, currentUser) {
    // TODO only allow if no activity has happened to the project
    const project = await ProjectModel.findOneAndUpdate(
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
    if (payload.financial_institutions) {
      payload.financial_institutions = payload.financial_institutions.split(',');
    }
    return ProjectModel.findOneAndUpdate({_id: id, is_archived: false}, payload, {
      new: true,
      runValidators: true
    });
  },

  countProject(currentUser) {
    const query = {is_archived: false};
    query.agency = currentUser.agency;

    return ProjectModel.find(query).countDocuments();
  },

  async getTokenAllocated(currentUser) {
    const $match = {$and: [{is_archived: false}, {agency: currentUser.agency}]};

    const query = [
      {
        $match
      },
      {
        $unwind: '$allocations'
      },
      {
        $group: {
          _id: '$_id',
          name: {$first: '$name'},
          token: {$sum: '$allocations.amount'}
        }
      }
    ];
    const projectAllocation = await ProjectModel.aggregate(query);
    const totalAllocation = projectAllocation.reduce((acc, {token}) => acc + token, 0);

    return {totalAllocation, projectAllocation};
  },

  async generateAidConnectId(projectId) {
    const project = await this.getById(projectId);
    if (project.aid_connect && project.aid_connect.id)
      return {
        data: {...project.aid_connect, link: `${aidConnectBaseURL}/${project.aid_connect.id}`}
      };
    const aid_connect_id = nanoid(12);
    const newProject = await ProjectModel.findOneAndUpdate(
      {_id: projectId},
      {aid_connect: {id: aid_connect_id, isActive: true}},
      {new: true}
    );

    return {
      data: {...newProject.aid_connect, link: `${aidConnectBaseURL}/${newProject.aid_connect.id}`}
    };
  },

  async changeAidConnectStatus(projectId, payload) {
    const {isActive} = payload;
    const {aid_connect} = await this.getById(projectId);
    if (!aid_connect.id)
      return {data: null, message: 'Aid-Connect Link Not Found for this project'};
    const newProject = await ProjectModel.findOneAndUpdate(
      {_id: projectId},
      {aid_connect: {id: aid_connect.id, isActive}},
      {new: true}
    );
    return {
      data: {...newProject.aid_connect, link: `${aidConnectBaseURL}/${newProject.aid_connect.id}`}
    };
  },

  getByAidConnectId(aidConnectId) {
    return ProjectModel.findOne({'aid_connect.id': aidConnectId});
  },

  async addInstitution(id, institutionId) {
    const institution = await InstitutionModel.findOne({_id: institutionId});
    if (!institution) throw Error('Institution with given Id not found');
    return ProjectModel.findOneAndUpdate(
      {_id: id},
      {$addToSet: {financial_institutions: institutionId}},
      {new: true, runValidators: true}
    );
  },

  async getInstitution(id) {
    const project = await ProjectModel.findOne({_id: id}).populate('financial_institutions');
    if (!project) throw Error('Project with given Id not found');
    return project.financial_institutions;
  }
};

module.exports = {
  Project,
  add: req => Project.add(req.payload),
  changeStatus: req => Project.changeStatus(req.params.id, req.payload),
  getById: req => Project.getById(req.params.id),
  addTokenAllocation: req => Project.addTokenAllocation(req.params.id, req.payload),
  addCampaignFundRaiser: req =>
    Project.addCampaignFundRaiser(req.params.id, req.currentUser, req.payload),
  token: req => Project.token(req.currentUser, req.payload),
  list: req => Project.list(req.query, req.currentUser),
  addBeneficiary: req => {
    req.payload.project_id = req.params.id;
    return Beneficiary.addToProject(req.payload);
  },
  listBeneficiaries: req => {
    req.query.projectId = req.params.id;
    return Beneficiary.list(req.query, req.currentUser);
  },
  listVendors: req => {
    req.query.projectId = req.params.id;
    return Vendor.list(req.query, req.currentUser);
  },
  remove: req => Project.remove(req.params.id, req.currentUser),
  update: req => Project.update(req.params.id, req.payload, req.currentUser),
  uploadAndAddBenfToProject: req => Project.uploadAndAddBenfToProject(req.params.id, req.payload),
  generateAidConnectId: req => Project.generateAidConnectId(req.params.id),
  changeAidConnectStatus: req => Project.changeAidConnectStatus(req.params.id, req.payload),
  addInstitution: req => Project.addInstitution(req.params.id, req.payload.institutionId),
  getInstitution: req => Project.getInstitution(req.params.id)
};
