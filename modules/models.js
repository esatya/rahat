const AgencyModel = require('./agency/agency.model');
const ProjectModel = require('./project/project.model');
const BeneficiaryModel = require('./beneficiary/beneficiary.model');
const VendorModel = require('./vendor/vendor.model');
const TxModel = require('./blockchain/transaction.model');
const TokenDistributionModel = require('./beneficiary/tokenDistribution.model');
const TokenRedemptionModel = require('./beneficiary/tokenRedemption.model');

function registerModels(database) {

}

module.exports = {
  registerModels,
  AgencyModel,
  BeneficiaryModel,
  ProjectModel,
  VendorModel,
  TokenDistributionModel,
  TokenRedemptionModel,
  TxModel,
};
