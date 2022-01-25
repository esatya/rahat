const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const { DataUtils } = require('../../helpers/utils');
const { AidConnectModel } = require('../models');

const { addFileToIpfs } = require('../../helpers/utils/ipfs');

const isObjectId = mongoose.Types.ObjectId;

const AidConnect = {
	// async add(payload) {
	// 	if (payload.govt_id_image) {
	// 		const decoded = await this.decodeBase64Image(payload.govt_id_image);
	// 		if (decoded.data) {
	// 			const ipfsIdHash = await this.uploadToIpfs(decoded.data);
	// 			payload.govt_id_image = ipfsIdHash;
	// 		}
	// 	}
	// 	if (payload.photo) {
	// 		const decoded = await this.decodeBase64Image(payload.photo);
	// 		if (decoded.data) {
	// 			const ipfsPhotoHash = await this.uploadToIpfs(decoded.data);
	// 			payload.photo = ipfsPhotoHash;
	// 		}
	// 	}

	// 	return AidConnectModel.create(payload);
	// },

	async add(payload) {
		const ben = await AidConnectModel.create(payload);
		// TODO implement blockchain function using project._id
		return ben;
	},

	async addMany(payload) {
		try {
			const data = await AidConnectModel.insertMany(payload, { ordered: false });
			const inserted = {
				total: data.length,
				data
			};
			return { inserted };
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
				return { inserted, failed };
			}
			throw Error(e);
		}
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

	async getbyId(id) {
		let ben;
		if (isObjectId.isValid(id)) {
			ben = await AidConnectModel.findOne({ _id: id, is_archived: false }).populate('project');
			if (!ben) {
				return false;
			}
			return ben;
		}
		ben = await AidConnectModel.findOne({ phone: id, is_archived: false });
		if (!ben) {
			return false;
		}

		return ben;
	},

	list(query) {
		const start = query.start || 0;
		const limit = query.limit || 10;
		const $match = { is_archived: false };
		if (query.show_archive) $match.is_archived = true;
		if (query.projectId) $match.projects = ObjectId(query.projectId);
		if (query.phone) $match.phone = { $regex: new RegExp(`${query.phone}`), $options: 'i' };
		if (query.name) $match.name = { $regex: new RegExp(`${query.name}`), $options: 'i' };
		const sort = {};
		if (query.sort === 'address' || query.sort === 'name') sort[query.sort] = 1;
		else sort.created_at = -1;

		return DataUtils.paging({
			start,
			limit,
			sort,
			model: AidConnectModel,
			query: [{ $match }]
		});
	},

	async remove(id) {
		const ben = await AidConnectModel.findOneAndUpdate({ _id: id }, { is_archived: true }, { new: true });
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

		return AidConnectModel.findOneAndUpdate({ _id: id, is_archived: false }, payload, {
			new: true,
			runValidators: true
		});
	}
};

module.exports = {
	AidConnect,
	add: req => AidConnect.add(req.payload),
	addMany: req => AidConnect.addMany(req.payload),
	getbyId: req => AidConnect.getbyId(req.params.id),
	list: req => AidConnect.list(req.query),
	remove: req => AidConnect.remove(req.params.id),
	update: req => AidConnect.update(req.params.id, req.payload)
};
