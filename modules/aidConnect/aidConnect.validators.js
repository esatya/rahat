const Joi = require('joi');
const GooseJoi = require('../../helpers/utils/goosejoi');

module.exports = {
  add: {
    payload: Joi.object({
      name: Joi.string().example('Ram Nepali'),
      phone: Joi.string().example('787878'),
      email: Joi.string().allow('').optional().example('nepali@gamil.com'),
      address: Joi.string().allow('').optional().example('kathmandu'),
      address_temporary: Joi.string().allow('').optional().example('dang'),
      gender: Joi.string().allow('').optional(),
      govt_id: Joi.string().allow('').optional().example('9799'),
      govt_id_image: Joi.string().allow('').optional().example('http://source'),
      photo: Joi.string().allow('').optional().example('http://source'),
      project: Joi.string().allow('').optional().example('5f6b2f815685931cbfe4dad8')
      // extras: Joi.object().optional()
    }).label('Beneficiary')
  },

  list: {
    params: Joi.object({
      aidConnectId: Joi.string()
    }),
    query: Joi.object({
      start: Joi.number(),
      limit: Joi.number(),
      name: Joi.string().allow(''),
      phone: Joi.string().allow('')
    })
  },
  addMany: {
    params: Joi.object({
      aidConnectId: Joi.string()
    }),
    payload: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().example('Ram Nepali'),
          phone: Joi.string().example('787878'),
          email: Joi.string().allow('').optional().example('nepali@gamil.com'),
          address: Joi.string().allow('').optional().example('kathmandu'),
          address_temporary: Joi.string().allow('').optional().example('dang'),
          gender: Joi.string().allow('').optional(),
          govt_id: Joi.string().allow('').optional().example('9799') // extras: Joi.object().optional()
        })
      )
      .label('Beneficiaries')
  },
  getbyId: {
    params: Joi.object({
      aidConnectId: Joi.string(),
      id: Joi.string()
    })
  },
  remove: {
    params: Joi.object({
      aidConnectId: Joi.string(),
      id: Joi.string()
    })
  },
  update: {
    params: GooseJoi.id(),
    payload: Joi.object({
      name: Joi.string().optional().example('Ram Nepali'),
      phone: Joi.string().optional().example('787878'),
      email: Joi.string().allow('').optional().example('nepali@gamil.com'),
      address: Joi.string().allow('').optional().example('kathmandu'),
      address_temporary: Joi.string().allow('').optional().example('dang'),
      gender: Joi.string().allow('').optional(),
      govt_id: Joi.string().allow('').optional().example('9799'),
      govt_id_image: Joi.string().allow('').optional().example('http://source'),
      photo: Joi.string().allow('').optional().example('http://source'),
      project: Joi.string().allow('').optional().example('5f6b2f815685931cbfe4dad8')
      // extras: Joi.object().optional()
    }).label('Beneficiary')
  },
  checkId: {
    params: Joi.object({
      aidConnectId: Joi.string()
    })
  }
};
