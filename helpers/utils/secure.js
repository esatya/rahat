const config = require('config');
const ethers = require('ethers');
const {User, getByWalletAddress} = require('../../modules/user/user.controllers');
const {Role} = require('../../modules/user/role.controllers');

const checkPermissions = (user_perm, access_perm) =>
  user_perm.some(v => access_perm.indexOf(v) !== -1);

const GetAddressFromSignature = signatureWithData => {
  if (!signatureWithData) throw Error("Must send 'auth-signature'");

  const [data, signature] = signatureWithData.split('.');
  const dateDiff = (Date.now() - parseInt(data, 10)) / 1000;

  if (dateDiff > config.get('app.signatureValidity')) throw Error('Signature has expired.');
  return ethers.utils.verifyMessage(data, signature);
};

const Secure = async (reoutePermissions, req) => {
  if (reoutePermissions.length === 0) return true;

  const token = req.query.access_token || req.headers.access_token;
  const authSignature = req.query.auth_signature || req.headers.auth_signature;
  let user;
  let permissions;
  const updateUserReq = async () => {
    try {
      if (user.roles) permissions = await Role.calculatePermissions(user.roles);
      req.currentUser = user;
      req.currentUserId = user._id;
      if (req.payload) {
        req.payload.updated_by = user._id;
        req.payload.currentUser = user;
        if (req.method.toLowerCase() === 'post') req.payload.created_by = user._id;
      }
      const userPerms = permissions || [];
      return checkPermissions(userPerms, reoutePermissions);
    } catch (e) {
      return false;
    }
  };
  if (!token && !authSignature) throw Error('No access token or authSignatures was sent');

  if (authSignature) {
    const wallet_address = GetAddressFromSignature(authSignature);
    user = await getByWalletAddress(wallet_address);
    return updateUserReq();
  }
  if (token) {
    const tokenData = await User.validateToken(token);
    user = tokenData.user;
    return updateUserReq();
  }
};

module.exports = Secure;
