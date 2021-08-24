const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const app = require('../../app');
const Logger = require('../../helpers/logger');
const { DataUtils } = require('../../helpers/utils');
const { BeneficiaryModel, TokenRedemptionModel, TokenDistributionModel } = require('../models');

const logger = Logger.getInstance();
const { addFileToIpfs } = require('../../helpers/utils/ipfs');

const isObjectId = mongoose.Types.ObjectId;

const Beneficiary = {
	async add(payload) {
		payload.agency = payload.currentUser.agency;
		payload.projects = payload.projects ? payload.projects.split(',') : [];
		if (payload.govt_id_image) {
			const ipfsIdHash = await this.uploadToIpfs(this.decodeBase64Image(payload.govt_id_image).data);
			payload.govt_id_image = ipfsIdHash;
		}
		if (payload.photo) {
			const ipfsPhotoHash = await this.uploadToIpfs(this.decodeBase64Image(payload.photo).data);
			payload.photo = ipfsPhotoHash;
		}

		return BeneficiaryModel.create(payload);
	},

	decodeBase64Image(dataString) {
		if (!dataString) return { type: null, data: null };
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
			{ _id: payload.id },
			{ $addToSet: { projects: payload.project_id } },
			{ new: 1 }
		);
	},

	async getbyId(id) {
		let ben;
		if (isObjectId.isValid(id)) {
			ben = await BeneficiaryModel.findOne({ _id: id, is_archived: false }).populate('projects');
			if (!ben) {
				return false;
			}
			return ben;
		}
		ben = await BeneficiaryModel.findOne({ phone: id, is_archived: false });
		if (!ben) {
			return false;
		}

		return ben;
	},

	getbyWallet(wallet_address) {
		return BeneficiaryModel.findOne({ wallet_address, is_archived: false });
	},

	list(query, currentUser) {
		const start = query.start || 0;
		const limit = query.limit || 10;

		const $match = { is_archived: false, agency: currentUser.agency };
		if (query.show_archive) $match.is_archived = true;
		if (query.projectId) $match.projects = ObjectId(query.projectId);
		if (query.phone) $match.phone = { $regex: new RegExp(`${query.phone}`), $options: 'i' };
		if (query.name) $match.name = { $regex: new RegExp(`${query.name}`), $options: 'i' };
		$match.agency = currentUser.agency;
		const sort = {};
		if (query.sort === 'address' || query.sort === 'name') sort[query.sort] = 1;
		else sort.created_at = -1;

		return DataUtils.paging({
			start,
			limit,
			sort,
			model: BeneficiaryModel,
			query: [{ $match }]
		});
	},

	async remove(id, curUserId) {
		const ben = await BeneficiaryModel.findOneAndUpdate(
			{ _id: id },
			{ is_archived: true, updated_by: curUserId },
			{ new: true }
		);
		// TODO blockchain call
		return ben;
	},

	update(id, payload) {
		delete payload.status;
		delete payload.balance;
		delete payload.agency;
		if (payload.projects) payload.projects = payload.projects.split(',');

		return BeneficiaryModel.findOneAndUpdate({ _id: id, is_archived: false }, payload, {
			new: true,
			runValidators: true
		});
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

	async countBeneficiary(currentUser) {
		const $match = { $and: [{ is_archived: false }, { agency: currentUser.agency }] };
		const query = [
			{ $match },
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
					name: { $first: '$projectData.name' },
					count: { $sum: 1 }
				}
			}
		];
		const totalCount = await BeneficiaryModel.find($match).countDocuments();
		const project = await BeneficiaryModel.aggregate(query);

		return { totalCount, project };
	}
};

module.exports = {
	Beneficiary,
	add: req => Beneficiary.add(req.payload),
	getbyId: req => Beneficiary.getbyId(req.params.id),
	list: req => Beneficiary.list(req.query, req.currentUser),
	remove: req => Beneficiary.remove(req.params.id, req.currentUserId),
	update: req => Beneficiary.update(req.params.id, req.payload),
	distributeToken: req => Beneficiary.distributeToken(req.params.id, req.payload),
	listTokenDistributions: req => Beneficiary.listTokenDistributions(req.params.id)
};
