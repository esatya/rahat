const Joi = require('joi');
const mongoose = require('mongoose');
const commonSchema = require('../../helpers/schema');
const CONSTANTS = require('../../constants');

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
    joi: Joi.string()
  },
  date: {
    type: Date,
    default: Date.now(),
    joi: Joi.date()
  },
  notificationType: {
    type: String,
    enum: CONSTANTS.NOTIFICATION_ENUMS(),
    joi: Joi.string()
  },
  status: {
    type: Boolean,
    default: false,
    joi: Joi.bool()
  },
  redirectUrl: {
    type: String,
    joi: Joi.string()
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
