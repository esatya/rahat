const {Agency} = require('../agency/agency.controllers');
const {SMS_TRIGGER_TYPE} = require('../../constants');
const SMS_SERVICE = require('../../helpers/utils/sms');

const Sms = {
  async sendSmsOnPackageIssue(payload) {
    try {
      const {packageName, phone} = payload;
      const agency = await Agency.getFirst();
      const sms_payload = {
        phone,
        data: {
          packageName,
          agency: agency?.name
        },
        smsType: SMS_TRIGGER_TYPE.packageIssued
      };
      const {data} = await SMS_SERVICE.send_sms(sms_payload);
      return data;
    } catch (e) {
      return {data: 'unable to send sms', status: false};
    }
  },
  async sendSmsOnTokenIssue(payload) {
    try {
      const {token, phone} = payload;
      const agency = await Agency.getFirst();
      const sms_payload = {
        phone,
        data: {
          token,
          agency: agency?.name
        },
        smsType: SMS_TRIGGER_TYPE.tokenIssued
      };
      const {data} = await SMS_SERVICE.send_sms(sms_payload);
      return data;
    } catch (e) {
      return {data: 'unable to send sms', status: false};
    }
  }
};
module.exports = {
  Sms,
  sendSmsOnPackageIssue: req => Sms.sendSmsOnPackageIssue(req.payload),
  sendSmsOnTokenIssue: req => Sms.sendSmsOnTokenIssue(req.payload)
};
