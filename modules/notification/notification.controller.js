const {NotificationModel} = require('../models');
const wss = require('../../helpers/utils/socket');
const {DataUtils} = require('../../helpers/utils');

const Notification = {
  async create(payload) {
    try {
      const notification = await NotificationModel.create(payload);
      const {title, message, date, notificationType} = notification;
      wss.broadcast({title, message, date, notificationType});
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
