const Joi = require('joi');
const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');

const schema = {
  name: {type: String, required: true, trim: true},
  phone: String,
  email: {type: String, joi: Joi.string().email()},
  address: String,
  is_approved: {type: Boolean, required: true, default: false},
  token: {
    name: {type: String},
    symbol: {type: String},
    supply: {type: Number}
  },
  contracts: {
    rahat: {type: String},
    rahat_admin: {type: String},
    rahat_erc20: {type: String},
    rahat_erc1155: {type: String}
  },
  kobotool_auth: {
    kpi: {type: String},
    token: {type: String}
  },
  kobotool_assets: [
    {
      asset_id: {type: String, unique: true},
      asset_name: {type: String},
      labels: [{type: String}],
      maps: {type: Object}
    }
  ],
  ...commonSchema
};

const agencySchema = mongoose.Schema(schema, {
  collection: 'agencies',
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

module.exports = mongoose.model('Agency', agencySchema);
