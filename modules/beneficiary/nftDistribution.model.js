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
  project_id: {
    type: ObjectId,
    required: true,
    ref: 'Project',
    description: 'Project ID'
  },
  package_name: {type: String},
  token_id: {
    type: Number,
    description: 'TokenId of the package'
  },
  amount: {
    type: Number,
    required: true,
    description: 'Amount of token to be distributed'
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
  extra: {type: Object},
  ...commonSchema
};

const nftDistributionSchema = mongoose.Schema(schema, {
  collection: 'nft_distributions',
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

module.exports = mongoose.model('nftDistribution', nftDistributionSchema);
