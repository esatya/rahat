const Joi = require('joi');
const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');

const schema = {
  title: {
    type: String,
    required: true,
    trim: true,
    joi: Joi.string()
  },
  message: {
    type: String,
    required: true,
    trim: true,
    joi: Joi.String()
  },
  date: {
    type: Date,
    default: Date.now(),
    joi: Joi.date()
  },
  ...commonSchema
};

const notificationSchema = mongoose.Schema(schema, {
  collection: 'notifications',
  timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

module.exports = mongoose.model('Notifcation', notificationSchema);
