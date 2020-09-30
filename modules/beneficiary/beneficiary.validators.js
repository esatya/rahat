const Joi = require('joi');
const { BeneficiaryModel, TokenDistributionModel } = require('../models');
const GooseJoi = require('../../helpers/utils/goosejoi');

const Beneficiary = GooseJoi.convert(BeneficiaryModel);
const TokenDistribution = GooseJoi.convert(TokenDistributionModel);

module.exports = {
  add: {
    payload: Joi.object({
      name: Beneficiary.name.example('Ram Nepali'),
      phone: Beneficiary.phone.example('787878'),
      wallet_address: Beneficiary.wallet_address.example('0x00'),
      email: Beneficiary.email.example('nepali@gamil.com'),
      address: Beneficiary.address.example('kathmandu'),
      address_temporary: Beneficiary.address_temporary.example('dang'),
      govt_id: Beneficiary.govt_id.optional().example('9799'),
      govt_id_image: Beneficiary.govt_id_image.optional().example('http://source'),
      photo: Beneficiary.photo.optional().example('http://source'),
      project_id: Joi.string().optional().example('5f6b2f815685931cbfe4dad8'),
    }).label('Beneficiary'),
  },
  getbyId: {
    params: GooseJoi.id(),
  },
  remove: {
    params: GooseJoi.id(),
  },
  update: {
    params: GooseJoi.id(),
    payload: Joi.object({
      name: Beneficiary.name.optional(),
      phone: Beneficiary.phone.optional(),
      wallet_address: Beneficiary.wallet_address.optional(),
      email: Beneficiary.email,
      address: Beneficiary.address,
      address_temporary: Beneficiary.address_temporary,
      govt_id: Beneficiary.govt_id,
      govt_id_image: Beneficiary.govt_id_image,
      photo: Beneficiary.photo,
    }).label('Beneficiary'),
  },
  listTokenDistributions: {
    params: GooseJoi.id(),
  },
  distributeToken: {
    params: GooseJoi.id(),
    payload: Joi.object({
      beneficiary_id: Joi.string().required().description('Beneficiary ID'),
      project_id: Joi.string().required().description('Project ID'),
      amount: TokenDistribution.amount,
      txhash: TokenDistribution.txhash,
    }).label('TokenDistribution'),
  },
};
