const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');
const {InstitutionConstants} = require('../../constants');

const {ObjectId} = mongoose.Schema;

const schema = {
  name: {
    type: String,
    required: true,
    trim: true,
    description: 'Name of institution'
  },
  account_number: {
    type: String,
    required: true,
    description: 'Account Number of institution'
  },
  bisCode: {
    type: String,
    description: 'BIS code of institution'
  },
  address: {
    type: String,
    description: 'Address of institution'
  },
  email: {
    type: String,
    description: 'Address of institution'
  },
  phone: {
    type: String,
    description: 'Phone of institution'
  },
  status: {
    type: String,
    required: true,
    default: InstitutionConstants.status.Active,
    enum: Object.values(InstitutionConstants.status),
    description: 'Status of institution'
  },
  project: {
    type: ObjectId,
    ref: 'Project',
    required: true,
    description: 'Project Id associated with institution'
  },
  logoUrl: {
    type: String,
    description: 'Logo url of institution'
  },
  agency: {
    type: ObjectId,
    required: true,
    ref: 'Agency',
    description: 'ID of agency that the project belongs to'
  },
  ...commonSchema
};

const institutionSchema = mongoose.Schema(schema, {
  collection: 'institutions',
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

module.exports = mongoose.model('Institution', institutionSchema);
