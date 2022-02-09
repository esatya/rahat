const {NOTIFICATION_TYPES} = require('../../constants');

function generateNotification(type, details) {
  switch (type) {
    case NOTIFICATION_TYPES.vendor_registered:
      return {
        title: 'New Vendor Registered',
        notificationType: 'Vendor Registered',
        message: `${details?.name} registered as a Vendor at ${details?.created_at}`,
        redirectUrl: `/vendors/${details?._id}`
      };
    case NOTIFICATION_TYPES.mobilizer_registered:
      return {
        title: 'New Mobilizer Registered',
        notificationType: 'Mobilizer Registered',
        message: `${details?.name} registered as a Mobilizer at ${details?.created_at}`,
        redirectUrl: `/mobilizers/${details?._id}`
      };

    default:
      return {
        title: 'New Notification',
        notificationType: 'Unknown',
        message: `New notification generated`
      };
  }
}

module.exports = generateNotification;
