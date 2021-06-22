const mongoose = require('mongoose');
const RSUser = require('rs-user');
const ethers = require('ethers');

const { ObjectId } = mongoose.Schema;

const ws = require('../../helpers/utils/socket');
const { DataUtils } = require('../../helpers/utils');
const { Role } = require('./role.controllers');

const User = new RSUser.User({
  mongoose,
  controllers: {
    role: Role,
  },
  schema: {
    agency: { type: ObjectId, required: true, ref: 'Agency' },
    wallet_address: { type: String, required: true, unique: true },
  },
});

const controllers = {
  User,
  async loginWallet(req) {
    const { payload } = req;
    const { id, signature } = payload;
    const client = ws.getClient(id);
    if (!client) throw Error('WebSocket client does not exist.');

    const publicKey = ethers.utils.recoverAddress(
      ethers.utils.hashMessage(client.token), signature,
    );
    const user = await controllers.getByWalletAddress(publicKey);

    if (user && !user.is_active) {
      ws.sendToClient(id, { action: 'account-locked' });
      return 'Your account is locked, please contact administrator.';
    }

    if (!user) {
      ws.sendToClient(id, { action: 'unauthorized', publicKey });
      return 'You are unathorized to use this service';
    }

    const accessToken = await User.generateToken(user);
    const authData = { action: 'access-granted', accessToken };
    if (payload.encryptedWallet) authData.encryptedWallet = payload.encryptedWallet;
    ws.sendToClient(id, authData);
    return 'You have successfully logged on to Rahat Systems.';
  },

  setWalletAddress(userId, walletAddress) {
    return User.update(userId, {
      wallet_address: walletAddress,
    });
  },

  getByWalletAddress(walletAddress) {
    return User.model.findOne({ wallet_address: walletAddress });
  },

  async addRoles({ userId, roles }) {
    const isValid = await Role.isValidRole(roles);
    if (!isValid) throw Error('role does not exist');
    return User.addRoles({ user_id: userId, roles });
  },

  list({
    start, limit, sort, filter, paging = true,
  }) {
    const query = [];
    if (filter) query.push({ $match: filter });
    query.push(
      {
        $addFields: { full_name: { $concat: ['$name.first', ' ', '$name.last'] } },
      },
      {
        $unset: ['password'],
      },
    );
    sort = sort || { 'name.first': 1 };

    if (paging) {
      return DataUtils.paging({
        start,
        limit,
        sort,
        model: User.model,
        query,
      });
    }

    query.push({ $sort: sort });
    return User.model.aggregate(query);
  },

  async add(request) {
    const data = request.payload;

    try {
      const user = await User.create(data);
      return user;
    } catch (e) {
      return e;
    }
  },

  async auth(request) {
    try {
      const token = request.query.access_token || request.headers.access_token || request.cookies.access_token;
      const { user, permissions } = await User.validateToken(token);

      return ({
        user, permissions,
      });
    } catch (e) {
      throw Error(`ERROR: ${e}`);
    }
  },
};

module.exports = controllers;
