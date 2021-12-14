const {ObjectId} = require('mongoose').Schema;

module.exports = {
  is_archived: {type: Boolean, required: true, default: false},
  created_by: {type: ObjectId, ref: 'User'},
  updated_by: {type: ObjectId, ref: 'User'}
};
