const {NotificationModel} = require('../models');
const wss = require('../../helpers/utils/socket');
const {DataUtils, NOTIFICATION_HELPER} = require('../../helpers/utils');

const Notification = {
  async create(payload) {
    const {type, ...newlyRegistered} = payload;
    try {
      const generatedNotification = NOTIFICATION_HELPER(type, newlyRegistered);
      const notification = await NotificationModel.create(generatedNotification);
      const {title, message, date, notificationType, status, redirectUrl} = notification;
      wss.broadcast({title, message, date, notificationType, status, redirectUrl});
      return notification;
    } catch (err) {
      throw Error(err);
    }
  },

  list(query) {
    const start = query.start || 0;
    const limit = query.limit || 5;
    const $match = {
      is_archived: false
    };
    if (query.show_archive) $match.is_archived = true;

    const sort = {created_at: -1};

    return DataUtils.paging({
      start,
      limit,
      sort,
      model: NotificationModel,
      query: [{$match}]
    });
  }
};

module.exports = {
  Notification,
  create: req => Notification.create(req.payload),
  list: req => Notification.list(req.query)
};
