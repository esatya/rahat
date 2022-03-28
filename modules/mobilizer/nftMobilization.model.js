const Joi = require('joi');
const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');

const {ObjectId} = mongoose.Schema;

const schema = {
  mobilizer_wallet: {
    type: String,
    required: true,
    ref: 'Mobilizer',
    description: 'Mobilizer ID - wallet-address'
  },
  amount: {
    type: Number,
    required: true,
    description: 'Amount Moblilized by mobilizer  / token issued to beneficiary'
  },
  package_name: {type: String},
  token_id: {
    type: Number,
    description: 'TokenId of the package'
  },
  beneficiary: {type: String, required: true, description: 'Beneficiary phone'},
  tx_hash: {
    type: String,
    required: true,
    unique: true,
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

const TokenMobilizationSchema = mongoose.Schema(schema, {
  collection: 'nft_mobilization',
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

TokenMobilizationSchema.index({tx_hash: 1}, {unique: true});

module.exports = mongoose.model('NftMobilization', TokenMobilizationSchema);
