const mongoose = require('mongoose');
const RSUser = require('rs-user');
const { RSUtils } = require('rumsan-core');
const { DataUtils } = require('../../helpers/utils');

const Role = new RSUser.Role({ mongoose });

module.exports = {
  Role,
  add: (req) => Role.add(req.payload),
  get: (req) => Role.get(req.params.id),
  delete: (req) => Role.get(req.params.id),
  async getPermissions(req) {
    const permissions = await Role.calculatePermissions(req.params.name);
    let data = [];
    data = [...permissions];
    const total = data.length;
    data = data.map((d) => ({
      permissions: d,
    }));
    return { data, total };
  },
  addPermissions: (req) => Role.addPermission({
    id: req.params.id,
    permissions: req.payload,
  }),
  removePermissions: (req) => Role.removePermission({
    id: req.params.id,
    permissions: req.payload,
  }),
  list(req) {
    const { limit, start, name } = req.query;
    const filter = {};
    if (name) {
      filter.name = {
        $regex: new RegExp(RSUtils.Text.escapeRegex(name), 'gi'),
      };
    }
    return DataUtils.paging({
      start,
      limit,
      sort: { name: 1 },
      model: Role.model,
      query: [
        {
          $match: filter,
        },
        {
          $project: {
            name: 1,
            permissions: 1,
            expiry_date: 1,
            is_system: 1,
          },
        },
      ],
    });
  },
};
