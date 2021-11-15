const { ObjectId } = require('mongoose').Types;

const { DataUtils } = require('../../helpers/utils');
const { NftModel } = require('../models');

const { addFileToIpfs } = require('../../helpers/utils/ipfs');
const { decodeBase64Url } = require('../../helpers/utils/fileManager');

const Nft = {
	async add(payload) {
		try {
			const { currentUser } = payload;
			// Upload image to IPFS and get CID
			const decoded = await decodeBase64Url(payload.packageImg);
			const img = await addFileToIpfs(decoded.data);
			const uploadedImgId = img.cid;
			// Upload metadata with image_cid and get metadata_URI
			const metaInfo = { ...payload.metadata, packageImgURI: uploadedImgId };
			const uploadedMeta = await addFileToIpfs(JSON.stringify(metaInfo));
			// Payload cleanups
			payload.metadataURI = uploadedMeta.cid;
			payload.metadata.packageImgURI = uploadedImgId;
			delete payload.packageImg;
			payload.createdBy = currentUser._id;
			// Save details to DB
			return NftModel.create(payload);
		} catch (err) {
			throw Error(err);
		}
	},

	async getById(id) {
		return NftModel.findOne({ _id: id });
	},

	async listByProject(req) {
		const { params, query } = req;
		const start = query.start || 0;
		const limit = query.limit || 10;

		let $match = { is_archived: false, project: ObjectId(params.id) };
		if (query.show_archive) $match = {};
		// $match.agency = currentUser.agency;
		if (query.name) $match.name = { $regex: new RegExp(`${query.name}`), $options: 'i' };

		const result = await DataUtils.paging({
			start,
			limit,
			sort: { created_at: -1 },
			model: NftModel,
			query: [{ $match }]
		});

		return result;
	},

	async remove(id) {
		const doc = await NftModel.findOneAndUpdate(
			{ _id: id },
			{ is_archived: true },
			{ new: true, runValidators: true }
		);
		return doc;
	},

	update(id, payload) {}
};

module.exports = {
	Nft,
	add: req => Nft.add(req.payload),
	getById: req => Nft.getById(req.params.id),
	listByProject: req => Nft.listByProject(req),
	remove: req => Nft.remove(req.params.id, req.currentUser),
	update: req => Nft.update(req.params.id, req.payload, req.currentUser)
};
