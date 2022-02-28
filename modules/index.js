const {Agency} = require('./agency/agency.controllers');
const {Beneficiary} = require('./beneficiary/beneficiary.controllers');
const {Vendor} = require('./vendor/vendor.controllers');
const {Project} = require('./project/project.controllers');
const {Institution} = require('./institution/institution.controllers');
const {Role} = require('./user/role.controllers');
const {User} = require('./user/user.controllers');
const {App} = require('./app/app.controllers');
const {Mobilizer} = require('./mobilizer/mobilizer.controllers');
const {Nft} = require('./nft/nft.controller');
const {Notification} = require('./notification/notification.controller');
const {Sms} = require('./sms/sms.controller');

module.exports = {
  Agency,
  Beneficiary,
  Vendor,
  Project,
  Institution,
  Role,
  User,
  App,
  Mobilizer,
  Nft,
  Notification,
  Sms
};
