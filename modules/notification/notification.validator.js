const Joi = require('joi');
const {NotificationModel} = require('../models');

const GooseJoi = require('../../helpers/utils/goosejoi');

const Notification = GooseJoi.convert(NotificationModel);

module.exports = {
  create: {
    payload: Joi.object({
      title: Notification.title.example('Test Notification'),
      message: Notification.message.example('Notification message'),
      notificationType: Notification.notificationType.example('Notification Type')
    }).label('notification')
  },
  list: {
    query: Joi.object({
      start: Joi.number(),
      limit: Joi.number(),
      status: Joi.bool(),
      show_archive: Joi.bool()
    })
  },
  update: {
    params: GooseJoi.id(),
    payload: Joi.object({
      status: Notification.status.example('True or false')
    })
  }
};
