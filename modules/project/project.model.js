const Joi = require('joi');
const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');
const {ProjectConstants} = require('../../constants');

const {ObjectId} = mongoose.Schema;

const schema = {
  name: {
    type: String,
    required: true,
    trim: true,
    description: 'Name of project'
  },
  status: {
    type: String,
    required: true,
    default: ProjectConstants.status.Draft,
    enum: Object.values(ProjectConstants.status),
    description: 'Status of project'
  },
  // TODO write cron job to disable project in end_date
  end_date: {type: Date, description: 'End date of project'},
  allocations: [
    {
      date: {type: Date, required: true, default: Date.now},
      amount: {type: Number, required: true},
      txhash: {type: String},
      success: {type: Boolean, required: true, default: false}
    }
  ],
  project_manager: {type: String}, // Wallet address
  location: {type: String, joi: Joi.string().example('kupondole')},
  financial_institutions: [{type: ObjectId, ref: 'Institution'}],
  description: String,
  agency: {
    type: ObjectId,
    required: true,
    ref: 'Agency',
    description: 'ID of agency that the project belongs to'
  },
  serial_index: {type: Number, required: true},
  ...commonSchema
};

const projectSchema = mongoose.Schema(schema, {
  collection: 'projects',
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

module.exports = mongoose.model('Project', projectSchema);
