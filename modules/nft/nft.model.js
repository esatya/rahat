const Joi = require('joi');
const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');

const { ObjectId } = mongoose.Schema;

const schema = {
	name: {
		type: String,
		required: true,
		trim: true,
		joi: Joi.string()
	},
	symbol: {
		type: String,
		required: true,
		joi: Joi.string()
	},
	tokenId: {
		type: String,
		required: true,
		unique: true,
		joi: Joi.string()
	},
	metadataUri: {
		type: String,
		required: true,
		joi: Joi.string()
	},
	metadata: { type: Object, joi: Joi.object() },
	project: {
		type: ObjectId,
		ref: 'Project',
		required: true,
		joi: Joi.string()
	},
	...commonSchema
};

const nftSchema = mongoose.Schema(schema, {
	collection: 'nfts',
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

module.exports = mongoose.model('Nft', nftSchema);
