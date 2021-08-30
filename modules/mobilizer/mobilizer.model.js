const Joi = require('joi');
const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');
const { MobilizerConstants } = require('../../constants');

const { ObjectId } = mongoose.Schema;

const schema = {
  name: {
    type: String, required: true, trim: true, description: 'Name of Mobilizer',
  },
  organization: {
    type: String, trim: true, description: 'Name of Organization mobilizer is involved with',
  },
  wallet_address: {
    type: String, required: true, trim: true, lowercase: true, description: 'Mobilizer wallet address',
  },
  phone: { type: String, required: true, description: 'Mobilizer phone' },
  email: { type: String, joi: Joi.string().email().optional().description('Mobilizer email') },
  address: { type: String, description: 'Mobilizer permanent address' },
  govt_id: { type: String, description: 'Mobilizer government issued ID' },
  govt_id_image: { type: String, joi: Joi.string().uri().optional().description('Mobilizer government issued ID image url') },
  photo: [{ type: String, joi: Joi.string().uri() }],
  agencies: [{
    agency: { type: ObjectId, ref: 'Agency' },
    status: {
      type: String,
      required: true,
      default: MobilizerConstants.status.New,
      enum: Object.values(MobilizerConstants.status),
    },
  }],
  projects: [{
    project: { type: ObjectId, ref: 'Project' },
    status: {
      type: String,
      required: true,
      default: MobilizerConstants.status.New,
      enum: Object.values(MobilizerConstants.status),
    },
  }],
  // TODO. This is Mobilizer app's passcode to help recover their account that is backed up in their Google drive.
  // This assume that mobilizer needs support from the Agency. Need to remove this long term.
  passcode: { type: String },
  ...commonSchema,
};

const mobilizerSchema = mongoose.Schema(
  schema, {
    collection: 'mobilizers',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

mobilizerSchema.index({ wallet_address: 1 }, { unique: true });

module.exports = mongoose.model('Mobilizer', mobilizerSchema);
