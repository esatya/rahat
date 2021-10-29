const Joi = require('joi');

/**
 * Validators for each endpoint.
 * payload, query, params
 */
module.exports = {
  setup: {
    payload: Joi.object({
      name: Joi.string().required().label('Agency Name').example('XYZ Org.'),
      phone: Joi.string().required().label('Phone number').example('123456789'),
      email: Joi.string().required().email().label('Phone number')
        .example('xyz@test.com'),
      address: Joi.string().label('Address').example('Kathmandu'),
      // contracts: Joi.object({
      //   rahat: Joi.string().required().example('0x66bBca46661c3F51c401aBfaBaF33c5295480896'),
      //   rahat_admin: Joi.string().required().example('0x66bBca46661c3F51c401aBfaBaF33c5295480896'),
      //   token: Joi.string().required().example('0x66bBca46661c3F51c401aBfaBaF33c5295480896'),
      // }),
      admin: Joi.object({
        name: Joi.string().required().example('John Doe'),
        phone: Joi.string().required().label('Phone number').example('123456789'),
        email: Joi.string().required().email().label('Phone number')
          .example('admin@test.com'),
        wallet_address: Joi.string().required().example('0x66bBca46661c3F51c401aBfaBaF33c5295480896'),
      }),
      token: Joi.object({
        name: Joi.string().required().example('RAHAT'),
        symbol: Joi.string().required().example('RTH'),
        supply: Joi.number().required().example(100000),
      }),

    }).label('AppSetup'),
  },
  getContractAbi: {
    params: Joi.object({
      contractName: Joi.string(),
    }),
  },
  getContractBytecode: {
    params: Joi.object({
      contractName: Joi.string(),
    }),
  },

  setKobotoolbox: {
    payload: Joi.object({
      kpi: Joi.string(),
      token: Joi.string(),
    }),
  },
  getKoboFormsData: {
    params: Joi.object({
      assetId: Joi.string(),
    }),
  },
};
