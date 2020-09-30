const Joi = require('joi');
const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');

const { ObjectId } = mongoose.Schema;

const schema = {
  beneficiary_id: {
    type: ObjectId,
    required: true,
    ref: 'Beneficiary',
    description: 'Beneficiary ID',
  },
  vendor_id: {
    type: ObjectId,
    required: true,
    ref: 'Vendor',
    description: 'Vendor ID',
  },
  amount: {
    type: Number,
    required: true,
    description: 'Amount spent by the beneficiary and transfered to vendor',
  },
  txhash: {
    type: String,
    required: true,
    description: 'Blockchain transaction hash',
  },
  success: {
    type: Number,
    required: true,
    default: false,
    description: 'Flag, if it has been successfully processed in blockchain',
  },
  ...commonSchema,
};

const monSchema = mongoose.Schema(
  schema, {
    collection: 'token_redemption',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

module.exports = mongoose.model('TokenRedemption', monSchema);
