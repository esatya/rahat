const { User } = require('../../modules/user/user.controllers');

const checkPermissions = (user_perm, access_perm) => user_perm.some((v) => access_perm.indexOf(v) !== -1);

const Secure = async (reoutePermissions, req) => {
  if (reoutePermissions.length === 0) return true;

  const token = req.query.access_token || req.headers.access_token;
  if (!token) throw Error('No access token was sent');

  try {
    const t = await User.validateToken(token);
    req.currentUser = t.user;
    req.currentUserId = t.user._id;
    if (req.payload) {
      req.payload.updated_by = t.user._id;
      req.payload.currentUser = t.user;
      if (req.method.toLowerCase() === 'post') req.payload.created_by = t.user._id;
    }
    const userPerms = t.permissions || [];
    return checkPermissions(userPerms, reoutePermissions);
  } catch (e) {
    return false;
  }
};

module.exports = Secure;
