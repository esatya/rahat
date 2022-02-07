const {Agency} = require('../agency/agency.controllers');
const {SMS_TRIGGER_TYPE} = require('../../constants');
const SMS_SERVICE = require('../../helpers/utils/sms');

const Sms = {
  async sendSmsOnPackageIssue(payload) {
    console.log('send sms package', payload);
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
    return SMS_SERVICE.send_sms(sms_payload);
  },
  async sendSmsOnTokenIssue(payload) {
    console.log('send sms token', payload);

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
    return SMS_SERVICE.send_sms(sms_payload);
  }
};
module.exports = {
  Sms,
  sendSmsOnPackageIssue: req => Sms.sendSmsOnPackageIssue(req.payload),
  sendSmsOnTokenIssue: req => Sms.sendSmsOnTokenIssue(req.payload)
};
