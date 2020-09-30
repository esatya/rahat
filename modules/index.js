const { Agency } = require('./agency/agency.controllers');
const { Beneficiary } = require('./beneficiary/beneficiary.controllers');
const { Vendor } = require('./vendor/vendor.controllers');
const { Project } = require('./project/project.controllers');
const { Role } = require('./user/role.controllers');
const { User } = require('./user/user.controllers');
const { App } = require('./app/app.controllers');

module.exports = {
  Agency,
  Beneficiary,
  Vendor,
  Project,
  Role,
  User,
  App,
};
