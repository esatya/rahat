const { Types } = require('mongoose');
const { DataUtils } = require('../../helpers/utils');

const { ProjectModel } = require('../models');
const { Beneficiary } = require('../beneficiary/beneficiary.controllers');
const { readExcelFile, removeExcelFile, uploadExcelFile } = require('../../helpers/utils/excelManager');

const Project = {
	// TODO: implement blockchain function using project._id
	async add(payload) {
		try {
			let uploaded_beneficiaries = 0;
			const { file, currentUser } = payload;
			payload.agency = currentUser.agency;
			const project = await ProjectModel.create(payload);
			if (file) {
				const uploaded = await uploadExcelFile(file);
				const rows = await readExcelFile(uploaded.file);
				if (rows.length) {
					uploaded_beneficiaries = await this.addBeneficiariesToProject(rows, project._id, currentUser);
				}
				await removeExcelFile(uploaded.file);
			}
			return { project, uploaded_beneficiaries };
		} catch (err) {
			throw Error(err);
		}
	},

	// TODO: remove temp wallet address
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
			payload.project_id = projectId;
			payload.currentUser = currentUser;
			const { name, phone } = payload;
			if (name && phone) {
				await Beneficiary.add(payload);
				upload_counter++;
			}
		}
		return upload_counter;
	},

	async changeStatus(id, payload) {
		const { status, updated_by } = payload;
		const project = await ProjectModel.findOneAndUpdate(
			{ _id: id, is_archived: false },
			{ status, updated_by },
			{ new: true, runValidators: true }
		);
		// TODO implement blockchain function using project._id
		return project;
	},

	getById(id) {
		return ProjectModel.findOne({ _id: id });
	},

	async addTokenAllocation(id, payload) {
		const allocationId = Types.ObjectId();
		const { amount, txhash, updated_by } = payload;
		const allocations = {
			_id: allocationId,
			amount,
			txhash
		};
		await ProjectModel.findOneAndUpdate(
			{ _id: id },
			{
				$addToSet: { allocations },
				updated_by
			},
			{ new: true, runValidators: true }
		);
		return allocations;
	},

	async confirmTokenAllocation(allocationId, txhash) {
		return ProjectModel.findOneAndUpdate(
			{ 'allocations._id': Types.ObjectId(allocationId) },
			{
				$set: {
					'allocations.$.txhash': txhash,
					'allocations.$.success': true
				}
			},
			{ new: true }
		);
	},

	list(query, currentUser) {
		const start = query.start || 0;
		const limit = query.limit || 20;

		let $match = { is_archived: false };
		if (query.show_archive) $match = {};
		$match.agency = currentUser.agency;
		if (query.name) $match.name = { $regex: new RegExp(`${query.name}`), $options: 'i' };
		if (query.status) $match.status = query.status;

		return DataUtils.paging({
			start,
			limit,
			sort: { name: 1 },
			model: ProjectModel,
			query: [{ $match }]
		});
	},

	async remove(id, currentUser) {
		// TODO only allow if no activity has happened to the project
		const project = await ProjectModel.findOneAndUpdate(
			{ _id: id },
			{ is_archived: true },
			{ new: true, runValidators: true }
		);
		// TODO blockchain call
		return project;
	},

	update(id, payload) {
		delete payload.status;
		delete payload.agency;
		return ProjectModel.findOneAndUpdate({ _id: id, is_archived: false }, payload, {
			new: true,
			runValidators: true
		});
	},

	countProject(currentUser) {
		const query = { is_archived: false };
		query.agency = currentUser.agency;

		return ProjectModel.find(query).countDocuments();
	},

	async getTokenAllocated(currentUser) {
		const $match = { $and: [{ is_archived: false }, { agency: currentUser.agency }] };

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
					name: { $first: '$name' },
					token: { $sum: '$allocations.amount' }
				}
			}
		];
		const projectAllocation = await ProjectModel.aggregate(query);
		const totalAllocation = projectAllocation.reduce((acc, { token }) => acc + token, 0);

		return { totalAllocation, projectAllocation };
	}
};

module.exports = {
	Project,
	add: req => Project.add(req.payload),
	changeStatus: req => Project.changeStatus(req.params.id, req.payload),
	getById: req => Project.getById(req.params.id),
	addTokenAllocation: req => Project.addTokenAllocation(req.params.id, req.payload),
	list: req => Project.list(req.query, req.currentUser),
	addBeneficiary: req => {
		req.payload.project_id = req.params.id;
		return Beneficiary.addToProject(req.payload);
	},
	listBeneficiaries: req => {
		req.query.projectId = req.params.id;
		return Beneficiary.list(req.query, req.currentUser);
	},
	remove: req => Project.remove(req.params.id, req.currentUser),
	update: req => Project.update(req.params.id, req.payload, req.currentUser)
};
