const Joi = require('joi');
const VendorModel = require('./vendor.model');
const {VendorConstants} = require('../../constants');

const GooseJoi = require('../../helpers/utils/goosejoi');

const Vendor = GooseJoi.convert(VendorModel);

module.exports = {
  add: {
    payload: Joi.object({
      name: Vendor.name.example('Rastra'),
      wallet_address: Vendor.wallet_address.example('0x00000'),
      phone: Vendor.phone.example('12121212'),
      email: Vendor.email.example('rastra@gmail.com'),
      gender: Joi.string().example('M').optional(),
      photo: Joi.string().optional(),
      shop_name: Vendor.shop_name,
      address: Vendor.address.example('Lalitpur'),
      govt_id: Vendor.govt_id.example('99988777nepal'),
      pan_number: Vendor.pan_number.example('1240000'),
      bank_name: Vendor.bank_name,
      bank_branch: Vendor.bank_branch,
      bank_account: Vendor.bank_account.example('2354394935034395'),
      projects: Joi.string()
        .allow('')
        .optional()
        .example('6108e3a19a8e17b54e464dd1,6208e3a19a8e17b54e464dd2'),
      govt_id_image: Vendor.govt_id_image,
      education: Vendor.education,
      extra_files: Joi.object().keys({
        identity_photo: Joi.string().allow('').allow(null).optional(),
        signature_photo: Joi.string().allow('').allow(null).optional(),
        mou_file: Joi.string().allow('').allow(null).optional()
      })
    }).label('Vendor')
  },
  getbyId: {
    params: Joi.object({
      id: Joi.string()
    })
  },
  addToProjectByvendorId: {
    params: GooseJoi.id(),
    payload: Joi.object({
      projectId: Joi.string()
    })
  },
  list: {
    query: Joi.object({
      start: Joi.number(),
      limit: Joi.number(),
      name: Joi.string(),
      phone: Joi.string(),
      projectId: Joi.string(),
      status: Joi.string(),
      show_archive: Joi.bool()
    })
  },

  remove: {
    params: GooseJoi.id()
  },
  update: {
    params: GooseJoi.id(),
    payload: Joi.object({
      name: Vendor.name.example('Rastra'),
      wallet_address: Vendor.wallet_address.example('0x00000'),
      phone: Vendor.phone.example('12121212'),
      email: Vendor.email.example('rastra@gmail.com'),
      gender: Joi.string().example('M').optional(),
      photo: Joi.string().optional(),
      shop_name: Vendor.shop_name,
      address: Vendor.address.example('Lalitpur'),
      govt_id: Vendor.govt_id.example('99988777nepal'),
      pan_number: Vendor.pan_number.example('1240000'),
      bank_name: Vendor.bank_name,
      bank_branch: Vendor.bank_branch,
      bank_account: Vendor.bank_account.example('2354394935034395'),
      projects: Joi.string()
        .allow('')
        .optional()
        .example('6108e3a19a8e17b54e464dd1,6208e3a19a8e17b54e464dd2'),
      govt_id_image: Vendor.govt_id_image,
      education: Vendor.education,
      extra_files: Joi.object().keys({
        identity_photo: Joi.string().allow('').allow(null).optional(),
        signature_photo: Joi.string().allow('').allow(null).optional(),
        mou_file: Joi.string().allow('').allow(null).optional()
      })
    }).label('Vendor')
  },

  approve: {
    payload: Joi.object({
      wallet_address: Joi.string().required().example('0x00')
    })
  },
  changeStatus: {
    params: Joi.object({
      id: Joi.string()
    }),
    payload: Joi.object({
      status: Joi.string().valid(...Object.values(VendorConstants.status))
    })
  },

  register: {
    payload: Joi.object({
      name: Vendor.name.optional().example('Rastra'),
      phone: Vendor.phone.optional().example('12121212'),
      wallet_address: Vendor.wallet_address.example('0x172d77Ff5cB061FE2dc77C149f5608789152d642'),
      email: Vendor.email.example('rastra@gmail.com'),
      address: Vendor.address.example('nepal'),
      govt_id: Vendor.govt_id.example('99988777nepal'),
      govt_id_image: Joi.string().description('ID Image').optional(),
      photo: Joi.string().description('Photo').optional()
    })
  },
  getTransactions: {
    params: Joi.object({
      id: Joi.string()
    })
  }
};
