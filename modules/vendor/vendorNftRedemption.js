const Joi = require('joi');
const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');

const {ObjectId} = mongoose.Schema;

const schema = {
  vendor_wallet: {
    type: String,
    required: true,
    ref: 'Vendor',
    description: 'Vendor ID - wallet-address'
  },
  amount: {
    type: Number,
    required: true,
    description: 'Amount redeemedto cash by beneficiary from agency'
  },
  package_name: {type: String},
  token_id: {
    type: Number,
    description: 'TokenId of the package'
  },
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

const vendorRedemptionSchema = mongoose.Schema(schema, {
  collection: 'vendor_nft_redemption',
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

vendorRedemptionSchema.index({tx_hash: 1}, {unique: true});

module.exports = mongoose.model('VendorNftRedemption', vendorRedemptionSchema);
