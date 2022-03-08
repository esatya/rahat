const config = require('config');
const axios = require('axios');
const {SMS_TRIGGER_TYPE} = require('../../constants');

const smsService = config.get('app.smsService');

const sparrowSms = async (phone, message) => {
  const smsApi = config.get(`services.${smsService}.url`);
  const token = config.get(`services.${smsService}.token`);
  const from = config.get(`services.${smsService}.from`);
  const SmsStatus = config.get(`services.${smsService}.active`);

  if (SmsStatus) {
    try {
      const res = await axios(smsApi, {
        params: {
          token,
          from,
          to: phone,
          text: message
        }
      });
      return res;
    } catch (e) {
      throw Error(e);
    }
  }
};

const prabhuSms = async (phone, message) => {
  const smsApi = config.get(`services.${smsService}.url`);
  const token = config.get(`services.${smsService}.token`);
  const from = config.get(`services.${smsService}.from`);
  const SmsStatus = config.get(`services.${smsService}.active`);

  if (SmsStatus) {
    try {
      const res = await axios(smsApi, {
        params: {
          token,
          from,
          to: phone,
          content: message
        }
      });
      return res;
    } catch (e) {
      throw Error(e);
    }
  }

  return false;
};

const SMS_SERVICE = {
  send_sms: async ({phone, smsType, data}) => {
    if (!phone) throw new Error('No receipent was specified');
    const message = SMS_SERVICE.get_message(smsType, data);
    if (!message) throw new Error('No Message was specified');
    if (smsService === 'sparrow_sms') {
      return sparrowSms(phone, message);
    }
    if (smsService === 'prabhu_sms') {
      return prabhuSms(phone, message);
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
