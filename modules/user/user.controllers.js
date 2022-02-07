const mongoose = require('mongoose');
const RSUser = require('rs-user');
const ethers = require('ethers');

const {ObjectId} = mongoose.Schema;

const ws = require('../../helpers/utils/socket');
const {DataUtils} = require('../../helpers/utils');
const {Role} = require('./role.controllers');
const {ROLES} = require('../../constants');
const Mailer = require('../../helpers/utils/mailer');

const User = new RSUser.User({
  mongoose,
  controllers: {
    role: Role
  },
  schema: {
    agency: {type: ObjectId, required: true, ref: 'Agency'},
    wallet_address: {type: String, required: true, unique: true}
  }
});

const controllers = {
  User,
  async loginWallet(req) {
    const {payload} = req;
    const {id, signature} = payload;
    const client = ws.getClient(id);
    if (!client) throw Error('WebSocket client does not exist.');

    const publicKey = ethers.utils.recoverAddress(
      ethers.utils.hashMessage(client.token),
      signature
    );
    const user = await controllers.getByWalletAddress(publicKey);
    if (user && !user.is_active) {
      ws.sendToClient(id, {action: 'account-locked', publicKey});
      return 'Your account is locked, please contact administrator.';
    }

    if (!user || !user.roles) {
      ws.sendToClient(id, {action: 'unauthorized', publicKey});
      return 'You are unathorized to use this service';
    }

    const accessToken = await User.generateToken(user);
    const authData = {action: 'access-granted', accessToken};
    if (payload.encryptedWallet) authData.encryptedWallet = payload.encryptedWallet;
    ws.sendToClient(id, authData);
    return 'You have successfully logged on to Rahat Systems.';
  },

  setWalletAddress(userId, walletAddress) {
    return User.update(userId, {
      wallet_address: walletAddress
    });
  },

  getByWalletAddress(walletAddress) {
    return User.model.findOne({wallet_address: walletAddress.toLowerCase()});
  },

  findById(request) {
    const isObjectId = mongoose.Types.ObjectId;

    if (isObjectId.isValid(request.params.id)) {
      return User.model.findOne({_id: request.params.id});
    }
    return controllers.getByWalletAddress(request.params.id);
  },

  async addRoles(request) {
    const userId = request.params.id;
    const {roles} = request.payload;
    const isValid = await Role.isValidRole(roles);
    if (!isValid) throw Error('role does not exist');
    await User.model.findByIdAndUpdate(userId, {is_active: true});
    return User.addRoles({user_id: userId, roles});
  },

  async update(request) {
    const userId = request.params.id;
    const data = request.payload;
    return User.update(userId, data);
  },

  async listByRole(req) {
    const {limit = 500, start = 0} = req.query;
    const {role} = req.params;
    const query = [
      {
        $match: {
          roles: {
            $in: [role]
          }
        }
      },
      {
        $project: {
          name: 1,
          _id: 1,
          wallet_address: 1,
          fullname: {$concat: ['$name.first', ' ', '$name.last']}
        }
      }
    ];

    return DataUtils.paging({
      start,
      limit,
      sort: {'name.first': 1},
      model: User.model,
      query
    });
  },

  list(request) {
    let {start, limit, sort, filter, name, paging = true, hideMobilizers} = request.query;
    const query = [];
    if (filter) query.push({$match: filter});
    if (name) {
      query.push({
        $match: {
          'name.first': {$regex: new RegExp(`${name}`), $options: 'i'}
        }
      });
    }

    query.push(
      {
        $addFields: {full_name: {$concat: ['$name.first', ' ', '$name.last']}}
      },
      {
        $unset: ['password']
      }
    );
    sort = sort || {'name.first': 1};

    if (hideMobilizers) {
      query.push({
        $match: {
          roles: {$nin: [ROLES.MOBILIZER]}
        }
      });
    }

    if (paging) {
      return DataUtils.paging({
        start,
        limit,
        sort: {created_at: -1},
        model: User.model,
        query
      });
    }

    query.push({$sort: sort});
    return User.model.aggregate(query);
  },

  async listAdmins() {
    const query = [
      {
        $match: {roles: ROLES.ADMIN}
      }
    ];
    return User.model.aggregate(query);
  },
  async sendMailToAdmin(mailPayload = {}) {
    try {
      const admins = await this.listAdmins();
      if (!admins.length) return null;
      return Promise.all(
        admins.map(admin =>
          Mailer.send({
            ...mailPayload,
            to: admin.email
          })
        )
      );
    } catch (err) {
      console.error('Error while sending mail to admins ===>', err);
    }
  },

  async checkUser(request) {
    const data = request.payload;
    if (!data.wallet_address) data.wallet_address = '';
    if (!data.phone) data.phone = '';
    if (!data.email) data.email = '';
    data.wallet_address = data.wallet_address.toLowerCase();
    const [user] = await User.model.find({
      $or: [{wallet_address: data.wallet_address}, {email: data.email}, {phone: data.phone}]
    });
    if (user) {
      if (user.phone === data.phone) throw new Error('Phone Number Already Exists');
      if (user.wallet_address.toLowerCase() === data.wallet_address.toLowerCase()) {
        throw Error('Wallet Address Already Exists');
      }
      if (user.email === data.email) throw Error('Email Already Exists');
      return false;
    }
    return {isNew: true};
  },

  async add(request) {
    const data = request.payload;
    try {
      //   await controllers.checkUser(request);
      data.wallet_address = data.wallet_address.toLowerCase();
      const user = await User.create(data);
      return user;
    } catch (e) {
      return e;
    }
  },

  async register(request) {
    const data = request.payload;
    data.is_active = false;
    try {
      //   await controllers.checkUser(request);
      data.wallet_address = data.wallet_address.toLowerCase();
      const user = await User.create(data);
      return user;
    } catch (e) {
      return e;
    }
  },

  async auth(request) {
    try {
      const token =
        request.query.access_token || request.headers.access_token || request.cookies.access_token;
      const {user, permissions} = await User.validateToken(token);

      return {
        user,
        permissions
      };
    } catch (e) {
      throw Error(`ERROR: ${e}`);
    }
  }
};

module.exports = controllers;

// module.exports = {
//   userControllers,
//   loginWallet: (req) => userControllers.loginWallet(req.payload),
//   findById: (req) => {
//     const { id } = req.params;
//     if (ethers.utils.isAddress(id)) return userControllers.getByWalletAddress(id, req.currentUser);
//     return userControllers.findById(req.params.id, req.currentUser);
//   },
//   list: (req) => userControllers.list(req.query),
// };
