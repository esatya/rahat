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
	phone: { type: String, required: true, description: 'Beneficiary phone' },
	gender: {
		type: String,
		required: true,
		default: 'U',
		enum: ['M', 'F', 'O', 'U']
	},
	dob: { type: Date, joi: Joi.string().optional().description('Beneficiary DOB') },
	email: { type: String, joi: Joi.string().email().optional().description('Beneficiary email') },
	address: { type: String, joi: Joi.string().optional().description('Beneficiary permanent address') },
	address_temporary: { type: String, joi: Joi.string().optional().description('Beneficiary temporary address') },
	govt_id: { type: String, joi: Joi.string().optional().description('Beneficiary government issued ID') },
	photo: { type: String, joi: Joi.string().optional().description('Beneficiary photo url') },
	govt_id_image: {
		type: String,
		joi: Joi.string().optional().description('Beneficiary government issued ID image url')
	},
	project: { type: ObjectId, ref: 'Project' },
	// extras: { type: Object },
	...commonSchema
};

const aidConnectSchema = mongoose.Schema(schema, {
	collection: 'aid_connect',
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

aidConnectSchema.index({ phone: 1, agency: 1 }, { unique: true });

module.exports = mongoose.model('AidConnect', aidConnectSchema);
