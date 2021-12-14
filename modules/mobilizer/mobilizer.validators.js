const Joi = require('joi');
const {example} = require('joi');
const MobilizerModel = require('./mobilizer.model');
const {VendorConstants} = require('../../constants');

const GooseJoi = require('../../helpers/utils/goosejoi');

const Mobilizer = GooseJoi.convert(MobilizerModel);

module.exports = {
  add: {
    payload: Joi.object({
      name: Mobilizer.name.optional().example('Rastra'),
      phone: Mobilizer.phone.optional().example('12121212'),
      wallet_address: Mobilizer.wallet_address.optional().example('0x00000'),
      email: Mobilizer.email.example('rastra@gmail.com'),
      address: Mobilizer.address.example('nepal'),
      govt_id: Mobilizer.govt_id.example('99988777nepal'),
      govt_id_image: Joi.string().description('ID Image').optional(),
      photo: Joi.string().description('Photo').optional(),
      organization: Mobilizer.organization.example('rumsan')
    }).label('Mobilizer')
  },
  getbyId: {
    params: Joi.object({
      id: Joi.string()
    })
  },
  list: {
    query: Joi.object({
      start: Joi.number(),
      limit: Joi.number(),
      name: Joi.string(),
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
      name: Mobilizer.name.optional().example('Rastra'),
      phone: Mobilizer.phone.optional().example('12121212'),
      wallet_address: Mobilizer.wallet_address.optional().example('0x00000'),
      email: Mobilizer.email.example('rastra@gmail.com'),
      address: Mobilizer.address.example('nepal'),
      govt_id: Mobilizer.govt_id.example('99988777nepal'),
      govt_id_image: Mobilizer.govt_id_image.example('http://source'),
      organization: Mobilizer.organization.example('rumsan')
    }).label('Mobilizer')
  },

  approve: {
    payload: Joi.object({
      wallet_address: Joi.string().required().example('0x00'),
      projectId: Joi.string()
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
      name: Mobilizer.name.optional().example('Rastra'),
      phone: Mobilizer.phone.optional().example('12121212'),
      wallet_address: Mobilizer.wallet_address.example(
        '0x172d77Ff5cB061FE2dc77C149f5608789152d642'
      ),
      email: Mobilizer.email.example('rastra@gmail.com'),
      address: Mobilizer.address.example('nepal'),
      organization: Mobilizer.organization.example('rumsan'),
      govt_id: Mobilizer.govt_id.example('99988777nepal'),
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
