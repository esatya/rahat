const agency = require('./agency/agency.routes');
const aidConnect = require('./aidConnect/aidConnect.routes');
const beneficiary = require('./beneficiary/beneficiary.routes');
const vendor = require('./vendor/vendor.routes');
const project = require('./project/project.routes');
const institution = require('./institution/institution.routes');
const auth = require('./user/auth.routes');
const role = require('./user/role.routes');
const user = require('./user/user.routes');
const setting = require('./app/app.routes');
const transactions = require('./blockchain/blockchain.routes');
const Mobilizer = require('./mobilizer/mobilizer.routes');
const Nft = require('./nft/nft.routes');
const Notification = require('./notification/notification.routes');
const Sms = require('./sms/sms.routes');

module.exports = {
  setting,
  project,
  institution,
  vendor,
  aidConnect,
  beneficiary,
  agency,
  auth,
  role,
  user,
  transactions,
  Mobilizer,
  Nft,
  Notification,
  Sms
};
