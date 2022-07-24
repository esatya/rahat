const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const app = require('../../app');
const {DataUtils} = require('../../helpers/utils');
const {
  BeneficiaryModel,
  TokenRedemptionModel,
  TokenDistributionModel,
  AidConnectModel,
  ProjectModel,
  VendorModel,
  InstitutionModel,
  MobilizerModel
} = require('../models');
const {addFileToIpfs} = require('../../helpers/utils/ipfs');
const {updateTotalSupply} = require('../nft/nft.controller');

const isObjectId = mongoose.Types.ObjectId;
const DEF_PACKAGE_ISSUE_QTY = 1;

const Beneficiary = {
  async add(payload) {
    const {currentUser} = payload;
    payload.agency = currentUser.agency;
    payload.projects = payload.projects ? payload.projects.split(',') : [];
    if (payload.govt_id_image) {
      const decoded = await this.decodeBase64Image(payload.govt_id_image);
      if (decoded.data) {
        const ipfsIdHash = await this.uploadToIpfs(decoded.data);
        payload.govt_id_image = ipfsIdHash;
      }
    }
    if (payload.photo) {
      const decoded = await this.decodeBase64Image(payload.photo);
      if (decoded.data) {
        const ipfsPhotoHash = await this.uploadToIpfs(decoded.data);
        payload.photo = ipfsPhotoHash;
      }
    }

    const benExists = await BeneficiaryModel.findOne({phone: payload.phone});
    if (payload.phone && benExists) {
      throw Error('Duplicate phone Number');
    }

    payload.created_by = currentUser._id;
    return BeneficiaryModel.create(payload);
  },

  // async checkPhoneExists(phone) {
  //   return BeneficiaryModel.find({phone});
  // }

  async addMany(payload) {
    const {currentUser} = payload;
    try {
      const benData = payload.map(el => {
        el.agency = currentUser.agency;
        if (!el.wallet_address) el.wallet_address = el.phone;
        return el;
      });
      const data = await BeneficiaryModel.insertMany(benData, {ordered: false});
      const inserted = {
        total: data.length,
        data
      };
      return {inserted};
    } catch (e) {
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

  addToProject(payload) {
    if (!payload.id) {
      return this.add(payload);
    }
    return BeneficiaryModel.findOneAndUpdate(
      {_id: payload.id},
      {$addToSet: {projects: payload.project_id}},
      {new: 1}
    );
  },

  addToProjectByBenfId(benfId, projectId) {
    return BeneficiaryModel.findOneAndUpdate(
      {_id: benfId},
      {$addToSet: {projects: projectId}},
      {new: 1}
    );
  },

  async getbyId(id) {
    let ben;
    if (isObjectId.isValid(id)) {
      ben = await BeneficiaryModel.findOne({_id: id, is_archived: false}).populate('projects');
      if (!ben) {
        return false;
      }
      return ben;
    }
    ben = await BeneficiaryModel.findOne({phone: id, is_archived: false});
    if (!ben) {
      return false;
    }

    return ben;
  },

  getbyWallet(wallet_address) {
    return BeneficiaryModel.findOne({wallet_address, is_archived: false});
  },

  list(query, currentUser) {
    const start = query.start || 0;
    const limit = query.limit || 10;

    const $match = {is_archived: false, agency: currentUser.agency};
    if (query.show_archive) $match.is_archived = true;
    if (query.projectId) $match.projects = ObjectId(query.projectId);
    if (query.phone) $match.phone = {$regex: new RegExp(`${query.phone}`), $options: 'i'};
    if (query.name) $match.name = {$regex: new RegExp(`${query.name}`), $options: 'i'};
    $match.agency = currentUser.agency;
    const sort = {};
    if (query.sort === 'address' || query.sort === 'name') sort[query.sort] = 1;
    else sort.created_at = -1;

    return DataUtils.paging({
      start,
      limit,
      sort,
      model: BeneficiaryModel,
      query: [
        {$match},
        {
          $lookup: {
            from: 'users',
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by'
          }
        },
        {
          $unwind: {path: '$created_by', preserveNullAndEmptyArrays: true}
        },
        {
          $addFields: {
            creator_name: {$concat: ['$created_by.name.first', ' ', '$created_by.name.last']}
          }
        }
      ]
    });
  },

  async remove(id, curUserId) {
    const ben = await BeneficiaryModel.findOneAndUpdate(
      {_id: id},
      {is_archived: true, updated_by: curUserId},
      {new: true}
    );
    // TODO blockchain call
    return ben;
  },

  // issued_packges = [2,3]
  async updateIssuedPackages(benfId, payload) {
    const {issued_packages} = payload;
    await updateTotalSupply(issued_packages, DEF_PACKAGE_ISSUE_QTY);
    return BeneficiaryModel.findByIdAndUpdate(benfId, {$addToSet: {issued_packages}}, {new: true});
  },

  async update(id, payload) {
    delete payload.status;
    delete payload.balance;
    delete payload.agency;
    if (payload.projects) payload.projects = payload.projects.split(',');

    if (payload.govt_id_image) {
      const decoded = await this.decodeBase64Image(payload.govt_id_image);
      if (decoded.data) {
        const ipfsIdHash = await this.uploadToIpfs(decoded.data);
        payload.govt_id_image = ipfsIdHash;
      }
    }
    if (payload.photo) {
      const decoded = await this.decodeBase64Image(payload.photo);
      if (decoded.data) {
        const ipfsPhotoHash = await this.uploadToIpfs(decoded.data);
        payload.photo = ipfsPhotoHash;
      }
    }

    return BeneficiaryModel.findOneAndUpdate({_id: id, is_archived: false}, payload, {
      new: true,
      runValidators: true
    });
  },

  async distributeToken(id, payload) {
    // const beneficiary = await this.getbyId(id);
    // if (!beneficiary) app.error('Invalid beneficiary ID.', 401);
    return TokenDistributionModel.create(payload);
  },

  async listTokenDistributions(id) {
    return TokenDistributionModel.find({beneficiary_id: id});
  },

  async redeemToken() {
    // TODO
  },

  async countBeneficiary(currentUser) {
    const $match = {$and: [{is_archived: false}, {agency: currentUser.agency}]};
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
      },
      {$sort: {created_at: -1, name: -1}}
    ];
    const totalCount = await BeneficiaryModel.find($match).countDocuments();
    const project = await BeneficiaryModel.aggregate(query).limit(5);

    return {totalCount, project};
  },

  async checkBeneficiary(phone) {
    const ben = await BeneficiaryModel.findOne({phone});
    if (ben) return {data: true, message: 'Beneficiary Exists'};
    return {data: false, message: 'Invalid Beneficiary Phone/Id'};
  },

  async countBeneficiaryViaProject() {
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
    const totalCount = await BeneficiaryModel.find($match).countDocuments();
    const project = await BeneficiaryModel.aggregate(query);

    return {totalCount, project};
  },

  calculateAge(birthday) {
    // birthday is a date
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  },
  increment(d) {
    return d++;
  },

  async countBeneficiaryViaAge(projectId) {
    // TODO calculate beneficiary by age - currently dummy data
    let dob;
    let totalCount;
    if (projectId) {
      totalCount = await BeneficiaryModel.countDocuments({projects: [projectId]});
      dob = await BeneficiaryModel.find({projects: [projectId]}).select('dob');
    } else {
      dob = await BeneficiaryModel.find().select('dob');
      totalCount = await BeneficiaryModel.countDocuments();
    }
    let b_10;
    b_10 = 0;
    let b10_20;
    b10_20 = 0;
    let b20_30;
    b20_30 = 0;
    let b30_40;
    b30_40 = 0;
    let b40_50;
    b40_50 = 0;
    let b50_;
    b50_ = 0;
    let unknown;
    unknown = 0;
    dob.map(el => {
      if (el.dob) {
        const age = this.calculateAge(el.dob);
        if (age < 10) b_10++;
        if (age > 10 && age < 20) b10_20++;
        if (age > 20 && age < 30) b20_30++;
        if (age > 30 && age < 40) b30_40++;
        if (age > 40 && age < 50) b40_50++;
        if (age > 50) b50_++;
      } else {
        unknown++;
      }
    });

    const data = {
      totalCount,
      beneficiaries: [
        {
          range: '-10',
          value: b_10
        },
        {
          range: '10-20',
          value: b10_20
        },
        {
          range: '20-30',
          value: b20_30
        },
        {
          range: '30-40',
          value: b30_40
        },
        {
          range: '40-50',
          value: b40_50
        },
        {
          range: '50-',
          value: b50_
        },
        {
          range: 'unknown',
          value: unknown
        }
      ]
    };
    return data;
  },

  async countBeneficiaryViaGender(from, to, projectId) {
    const dateFilter =
      from && to
        ? {
            created_at: {
              $gt: new Date(from),
              $lt: new Date(to)
            }
          }
        : null;
    const totalCount = projectId
      ? await BeneficiaryModel.countDocuments({
          projects: [projectId],
          ...dateFilter
        })
      : await BeneficiaryModel.countDocuments({
          ...dateFilter
        });
    const male = projectId
      ? await BeneficiaryModel.countDocuments({
          projects: [projectId],
          gender: 'M',
          ...dateFilter
        })
      : await BeneficiaryModel.countDocuments({
          gender: 'M',
          ...dateFilter
        });
    const female = projectId
      ? await BeneficiaryModel.countDocuments({
          projects: [projectId],
          gender: 'F',
          ...dateFilter
        })
      : await BeneficiaryModel.countDocuments({
          gender: 'F',
          ...dateFilter
        });
    const other = projectId
      ? await BeneficiaryModel.countDocuments({
          projects: [projectId],
          gender: 'O',
          ...dateFilter
        })
      : await BeneficiaryModel.countDocuments({
          gender: 'O',
          ...dateFilter
        });
    const unknown = projectId
      ? await BeneficiaryModel.countDocuments({
          projects: [projectId],
          gender: 'U',
          ...dateFilter
        })
      : await BeneficiaryModel.countDocuments({
          gender: 'U',
          ...dateFilter
        });
    const data = {
      totalCount,
      beneficiaries: [
        {
          name: 'Male',
          count: male
        },
        {
          name: 'Female',
          count: female
        },
        {
          name: 'Other',
          count: other
        },
        {
          name: 'Unknown',
          count: unknown
        }
      ]
    };

    return data;
  },
  async countBeneficiaryViaAidConnect(projectId) {
    if (!projectId) return 0;
    const {aid_connect} = await ProjectModel.findOne({_id: projectId});
    if (!aid_connect) return 0;
    return AidConnectModel.countDocuments({aid_connect_id: aid_connect.id});
  },
  async getProjectNames(data) {
    const projectsInvolved = [];
    for (let i = 0; i < data.projects.length; i++) {
      projects = data.projects[i];
      projectsInvolved.push(await this.fetchProjectNameById(projects));
    }
    return projectsInvolved;
  },
  async fetchProjectNameById(projectId) {
    const {name, allocations} = await ProjectModel.findOne({_id: projectId});
    return {name, allocations};
  },
  async parseBeneficiaryReportData(beneficiaryData) {
    const reportData = [];
    for (let i = 0; i < beneficiaryData.length; i++) {
      const data = beneficiaryData[i];
      const projectsInvolved = await this.getProjectNames(data);
      const projectsName = projectsInvolved.map(projects => {
        return projects.name;
      });
      const allocations = projectsInvolved.map(projects => {
        return projects.allocations.map(allocation => {
          return allocation.amount;
        });
      })[0];
      let TotalAllocations = 0;
      allocations.map(amount => {
        TotalAllocations += amount;
      });

      reportData.push({
        Name: data.name,
        'Phone Number': data.phone,
        'Permanent Address': data.address,
        'Email address': data.email,
        'Government id': data.govt_id,
        Age: data?.extras?.age || 'unknown',
        Gender: data.gender,
        'Projects involved': projectsName.join(' ,'),
        Education: data?.extras?.education || 'unknown',
        Profession: data?.extras?.profession || 'unknown',
        'Number of Family Members': data?.extras?.family_members || 'unknown',
        'Registration date': data.created_at,
        'Token Issues': TotalAllocations
      });
    }
    return reportData;
  },
  async getBeneficiariesNumber(projectId) {
    return BeneficiaryModel.countDocuments({projects: [projectId]});
  },
  async getVendorsNumber(projectId) {
    return VendorModel.countDocuments({projects: [projectId]});
  },
  async getMobilizersNumber(projectId) {
    return MobilizerModel.countDocuments({'projects.project': projectId});
  },
  async getFinancialInstituesNumber(projectId) {
    return InstitutionModel.countDocuments({projects: [projectId]});
  },
  async parseProjectReportData(projectData) {
    const reportData = [];
    for (let i = 0; i < projectData.length; i++) {
      const data = projectData[i];
      const numberOfBeneficiaries = await this.getBeneficiariesNumber(data._id);
      const numberOfVendors = await this.getVendorsNumber(data._id);
      const numberOfMobilizers = await this.getMobilizersNumber(data._id);
      const numberOfFinancialInstitues = data.financial_institutions
        ? data.financial_institutions.length
        : 0;

      const allocations = data.allocations.map(allocation => {
        return allocation.amount;
      });
      let TotalAllocations = 0;
      allocations.map(amount => {
        TotalAllocations += amount;
      });
      reportData.push({
        Name: data.name,
        Status: data.status,
        'Number of Beneficiaries': numberOfBeneficiaries,
        'Number of Vendors': numberOfVendors,
        'Number of Mobilizers': numberOfMobilizers,
        'Number of Financial Institues': numberOfFinancialInstitues,
        'Created Date': data.created_at,
        'Total Token Allocations': TotalAllocations,
        id: data._id
      });
    }
    return reportData;
  },
  async getBeneficiaryExportData(from, to, projectId) {
    const dateFilter =
      from && to
        ? {
            created_at: {
              $gt: new Date(from),
              $lt: new Date(to)
            }
          }
        : null;

    const reportData = projectId
      ? await BeneficiaryModel.find({
          projects: [projectId],
          ...dateFilter
        })
      : await BeneficiaryModel.find({
          ...dateFilter
        });

    return await this.parseBeneficiaryReportData(reportData);
  },
  async getProjectExportData(from, to, projectId) {
    const dateFilter =
      from && to
        ? {
            created_at: {
              $gt: new Date(from),
              $lt: new Date(to)
            }
          }
        : null;

    const reportData = projectId
      ? await ProjectModel.find({
          projects: [projectId],
          ...dateFilter
        })
      : await ProjectModel.find({
          ...dateFilter
        });
    return await this.parseProjectReportData(reportData);
  },
  async getReportingData(query) {
    const beneficiaryByGender = await this.countBeneficiaryViaGender(
      query.from,
      query.to,
      query.projectId
    );
    const beneficiaryByProject = await this.countBeneficiaryViaProject();
    const beneficiaryByAge = await this.countBeneficiaryViaAge(query.projectId);
    const beneficiaryViaAidConnect = await this.countBeneficiaryViaAidConnect(query.projectId);
    const beneficiaryExportData = await this.getBeneficiaryExportData(
      query.from,
      query.to,
      query.projectId
    );
    const projectExportData = await this.getProjectExportData(
      query.from,
      query.to,
      query.projectId
    );
    return {
      beneficiaryByGender,
      beneficiaryByProject,
      beneficiaryByAge,
      beneficiaryViaAidConnect,
      beneficiaryExportData,
      projectExportData
    };
  }
};

module.exports = {
  Beneficiary,
  add: req => Beneficiary.add(req.payload),
  addMany: req => Beneficiary.addMany(req.payload),
  getbyId: req => Beneficiary.getbyId(req.params.id),
  list: req => Beneficiary.list(req.query, req.currentUser),
  remove: req => Beneficiary.remove(req.params.id, req.currentUserId),
  update: req => Beneficiary.update(req.params.id, req.payload),
  distributeToken: req => Beneficiary.distributeToken(req.params.id, req.payload),
  listTokenDistributions: req => Beneficiary.listTokenDistributions(req.params.id),
  updateIssuedPackages: req => Beneficiary.updateIssuedPackages(req.params.id, req.payload),
  addToProjectByBenfId: req => {
    const benfId = req.params.id;
    const {projectId} = req.payload;
    return Beneficiary.addToProjectByBenfId(benfId, projectId);
  },
  checkBeneficiary: req => Beneficiary.checkBeneficiary(req.params.phone),
  getReportingData: req => Beneficiary.getReportingData(req.query)
};
