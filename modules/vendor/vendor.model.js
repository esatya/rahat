const Joi = require('joi');
const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');
const { VendorConstants } = require('../../constants');

const { ObjectId } = mongoose.Schema;

const schema = {
  name: {
    type: String, required: true, trim: true, description: 'Name of vendor',
  },
  wallet_address: {
    type: String, required: true, trim: true, lowercase: true, description: 'Vendor wallet address',
  },
  phone: { type: String, required: true, description: 'Vendor phone' },
  email: { type: String, joi: Joi.string().email().optional().description('Vendor email') },
  address: { type: String, description: 'Vendor permanent address' },
  govt_id: { type: String, description: 'Vendor government issued ID' },
  govt_id_image: { type: String, joi: Joi.string().uri().optional().description('Vendor government issued ID image url') },
  photo: [{ type: String, joi: Joi.string().uri() }],
  agencies: [{
    agency: { type: ObjectId, ref: 'Agency' },
    status: {
      type: String,
      required: true,
      default: VendorConstants.status.New,
      enum: Object.values(VendorConstants.status),
    },
  }],
  // TODO. This is vendor app's passcode to help recover their account that is backed up in their Google drive.
  // This assume that vendor needs support from the Agency. Need to remove this long term.
  passcode: { type: String },
  ...commonSchema,
};

const vendorSchema = mongoose.Schema(
  schema, {
    collection: 'vendors',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

vendorSchema.index({ wallet_address: 1 }, { unique: true });

module.exports = mongoose.model('Vendor', vendorSchema);
