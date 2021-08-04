const AgencyModel = require('./agency/agency.model');
const ProjectModel = require('./project/project.model');
const BeneficiaryModel = require('./beneficiary/beneficiary.model');
const InstitutionModel = require('./institution/institution.model');
const VendorModel = require('./vendor/vendor.model');
const TxModel = require('./blockchain/transaction.model');
const TokenDistributionModel = require('./beneficiary/tokenDistribution.model');
const TokenRedemptionModel = require('./beneficiary/tokenRedemption.model');
const MobilizerModel = require('./mobilizer/mobilizer.model');

function registerModels(database) {

}

module.exports = {
  registerModels,
  AgencyModel,
  BeneficiaryModel,
  InstitutionModel,
  ProjectModel,
  VendorModel,
  TokenDistributionModel,
  TokenRedemptionModel,
  TxModel,
  MobilizerModel,
};
