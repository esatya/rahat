const Joi = require('joi');
const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');
const { VendorConstants } = require('../../constants');

const { ObjectId } = mongoose.Schema;

const schema = {
	name: {
		type: String,
		required: true,
		trim: true,
		description: 'Name of vendor'
	},
	wallet_address: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		description: 'Vendor wallet address'
	},
	phone: { type: String, required: true, description: 'Vendor phone' },
	email: {
		type: String,
		joi: Joi.string().allow('').email().optional().description('Vendor email')
	},
	gender: {
		type: String,
		default: 'U',
		enum: ['M', 'F', 'O', 'U']
	},
	shop_name: { type: String, joi: Joi.string().allow('').optional().description('Vendor shop name') },
	address: { type: String, joi: Joi.string().allow('').optional() },
	govt_id: { type: String, joi: Joi.string().allow('').optional() },
	pan_number: { type: String, joi: Joi.string().allow('').optional().description('Vendor PAN number') },
	bank_name: { type: String, joi: Joi.string().allow('').optional().description('Bank name') },
	bank_branch: { type: String, joi: Joi.string().allow('').optional().description('Bank branch name') },
	bank_account: { type: String, joi: Joi.string().allow('').optional().description('Bank account number') },
	education: { type: String, joi: Joi.string().allow('').optional().description('Vendor eductaion') },
	govt_id_image: {
		type: String,
		joi: Joi.string().uri().optional().description('Vendor government issued ID image url')
	},
	extra_files: {
		identity_photo: String,
		signature_photo: String,
		mou_file: String
	},
	photo: [{ type: String, joi: Joi.string().uri() }],
	projects: [{ type: ObjectId, ref: 'Project' }],
	agencies: [
		{
			agency: { type: ObjectId, ref: 'Agency' },
			status: {
				type: String,
				required: true,
				default: VendorConstants.status.New,
				enum: Object.values(VendorConstants.status)
			}
		}
	],
	// TODO. This is vendor app's passcode to help recover their account that is backed up in their Google drive.
	// This assume that vendor needs support from the Agency. Need to remove this long term.
	passcode: { type: String },
	...commonSchema
};

const vendorSchema = mongoose.Schema(schema, {
	collection: 'vendors',
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

vendorSchema.index({ wallet_address: 1 }, { unique: true });

module.exports = mongoose.model('Vendor', vendorSchema);
