const config = require('config');
const axios = require('axios');
const {SMS_TRIGGER_TYPE} = require('../../constants');

const smsApi = config.get('services.sparrow_sms.url');
const token = config.get('services.sparrow_sms.token');
const from = config.get('services.sparrow_sms.from');
const SmsStatus = config.get('services.sparrow_sms.active');

const SMS_SERVICE = {
  send_sms: async ({phone, smsType, data}) => {
    if (!phone) throw new Error('No receipent was specified');
    const message = SMS_SERVICE.get_message(smsType, data);
    if (!message) throw new Error('No Message was specified');
    if (SmsStatus) {
      try {
        await axios(smsApi, {
          params: {
            token,
            from,
            to: phone,
            text: message
          }
        });
      } catch (e) {
        throw Error(e);
      }
    }
  },
  get_message: (type, data) => {
    switch (type) {
      case SMS_TRIGGER_TYPE.tokenIssued:
        return `you have received ${data?.token} tokens from ${data?.agency}`;
      case SMS_TRIGGER_TYPE.packageIssued:
        return `you have received ${data?.packageName} package from ${data?.agency}`;
      default:
        return null;
    }
  }
};

module.exports = SMS_SERVICE;
