const Joi = require('joi');
const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');

const { ObjectId } = mongoose.Schema;

const schema = {
	name: {
		type: String,
		required: true,
		trim: true,
		description: 'Name of beneficiary'
	},
	wallet_address: {
		type: String,
		trim: true,
		joi: Joi.string().optional().description('Beneficiary wallet address')
	},
	phone: { type: String, required: true, description: 'Beneficiary phone' },
	gender: {
		type: String,
		required: true,
		default: 'U',
		enum: ['M', 'F', 'O', 'U']
	},
	dob: { type: Date, joi: Joi.string().optional().description('Beneficiary DOB') },
	agency: { type: ObjectId, ref: 'Agency' },
	email: { type: String, joi: Joi.string().email().optional().description('Beneficiary email') },
	address: { type: String, joi: Joi.string().optional().description('Beneficiary permanent address') },
	address_temporary: { type: String, joi: Joi.string().optional().description('Beneficiary temporary address') },
	govt_id: { type: String, joi: Joi.string().optional().description('Beneficiary government issued ID') },
	photo: { type: String, joi: Joi.string().optional().description('Beneficiary photo url') },
	govt_id_image: {
		type: String,
		joi: Joi.string().optional().description('Beneficiary government issued ID image url')
	},
	projects: [{ type: ObjectId, ref: 'Project' }],
	extras: { type: Object },
	...commonSchema
};

const benSchema = mongoose.Schema(schema, {
	collection: 'beneficiaries',
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

benSchema.index({ phone: 1, agency: 1 }, { unique: true });
benSchema.index({ wallet_address: 1, agency: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Beneficiary', benSchema);
