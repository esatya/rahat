const Joi = require('joi');
const { example } = require('joi');
const VendorModel = require('./vendor.model');
const { VendorConstants } = require('../../constants');

const GooseJoi = require('../../helpers/utils/goosejoi');

const Vendor = GooseJoi.convert(VendorModel);

module.exports = {
  add: {
    payload: Joi.object({
      name: Vendor.name.optional().example('Rastra'),
      phone: Vendor.phone.optional().example('12121212'),
      wallet_address: Vendor.wallet_address.optional().example('0x00000'),
      email: Vendor.email.example('rastra@gmail.com'),
      address: Vendor.address.example('nepal'),
      govt_id: Vendor.govt_id.example('99988777nepal'),
      govt_id_image: Vendor.govt_id_image.example('http://source'),
    }).label('Vendor'),
  },
  getbyId: {
    params: Joi.object({
      id: Joi.string(),
    }),
  },
  remove: {
    params: GooseJoi.id(),
  },
  update: {
    params: GooseJoi.id(),
    payload: Joi.object({
      name: Vendor.name.optional().example('Rastra'),
      phone: Vendor.phone.optional().example('12121212'),
      wallet_address: Vendor.wallet_address.optional().example('0x00000'),
      email: Vendor.email.example('rastra@gmail.com'),
      address: Vendor.address.example('nepal'),
      govt_id: Vendor.govt_id.example('99988777nepal'),
      govt_id_image: Vendor.govt_id_image.example('http://source'),
    }).label('Vendor'),
  },

  approve: {
    payload: Joi.object({
      wallet_address: Joi.string().required().example('0x00'),
    }),
  },
  changeStatus: {
    params: Joi.object({
      id: Joi.string(),
    }),
    payload: Joi.object({
      status: Joi.string().valid(...Object.values(VendorConstants.status)),
    }),
  },

  register: {
    payload: Joi.object({
      name: Vendor.name.optional().example('Rastra'),
      phone: Vendor.phone.optional().example('12121212'),
      wallet_address: Vendor.wallet_address.example('0x172d77Ff5cB061FE2dc77C149f5608789152d642'),
      email: Vendor.email.example('rastra@gmail.com'),
      address: Vendor.address.example('nepal'),
      govt_id: Vendor.govt_id.example('99988777nepal'),
    }),
  },
  getTransactions: {
    params: Joi.object({
      id: Joi.string(),
    }),
  },
};
