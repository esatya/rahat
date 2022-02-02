const {NotificationModel} = require('../models');

const wss = require('../../helpers/utils/socket');

const Notification = {
  async create(payload) {
    try {
      const notification = await NotificationModel.create(payload);
      console.log({notification});
      const message = {
        type: notification.type,
        message: notification.message,
        date: notification.date
      };
      console.log({message});
      wss.broadcast(message);
      console.log({notification});
      return notification;
    } catch (err) {
      throw Error(err);
    }
  }
};

module.exports = {
  Notification,
  create: req => Notification.create(req.payload)
};
