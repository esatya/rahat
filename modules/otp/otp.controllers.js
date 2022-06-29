const config = require('config');
const mongoose = require('mongoose');
const OTP = require('rs-otp');

const Otp = new OTP.OTP({
  mongoose
});

const controllers = {
  Otp,
  generate(request) {
    const {address} = request.payload;
    const expiry_duration_in_minutes = config.get('services.otp.expiry_duration_in_minutes');
    return Otp.createOTP({address, expiry_duration_in_minutes});
  },

  verify(request) {
    const {otp} = request.payload;
    return Otp.verifyOTP({otp});
  }
};

module.exports = controllers;
