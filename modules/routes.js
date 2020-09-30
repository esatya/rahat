const agency = require('./agency/agency.routes');
const beneficiary = require('./beneficiary/beneficiary.routes');
const vendor = require('./vendor/vendor.routes');
const project = require('./project/project.routes');
const auth = require('./user/auth.routes');
const role = require('./user/role.routes');
const user = require('./user/user.routes');
const setting = require('./app/app.routes');
const transactions = require('./blockchain/blockchain.routes');

module.exports = {
  setting,
  project,
  vendor,
  beneficiary,
  agency,
  auth,
  role,
  user,
  transactions,
};
