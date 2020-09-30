// const AidToken = artifacts.require('AidToken');
// const CashAid = artifacts.require('CashAid');
// const TokenFactory = artifacts.require('TokenFactory');
const RahatAdmin = artifacts.require('RahatAdmin');

module.exports = function (deployer) {
  deployer.deploy(RahatAdmin, 10000000, 'RAHAT', 'RTH', '0xbFD3d0ec185E402b83f5b770e2a4D2dd1a6D94e3');
};
