const Joi = require('joi');
const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');

const {ObjectId} = mongoose.Schema;

const schema = {
  beneficiary_id: {
    type: String,
    required: true,
    description: 'Beneficiary ID'
  },
  vendor_id: {
    type: String,
    required: true,
    description: 'Vendor ID'
  },
  amount: {
    type: Number,
    required: true,
    description: 'Amount spent by the beneficiary and transfered to vendor'
  },
  txhash: {
    type: String,
    required: true,
    description: 'Blockchain transaction hash'
  },
  success: {
    type: Number,
    required: true,
    default: false,
    description: 'Flag, if it has been successfully processed in blockchain'
  },
  ...commonSchema
};

const monSchema = mongoose.Schema(schema, {
  collection: 'vendor_token_charge',
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

module.exports = mongoose.model('TokenCharge', monSchema);
