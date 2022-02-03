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
      show_archive: Joi.bool()
    })
  }
};
