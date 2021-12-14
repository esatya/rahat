const Joi = require('joi');
const mongoose = require('mongoose');
const {TransactionConstants} = require('../../constants');

const TransactionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    details: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    from: String,
    gas: {
      type: String,
      required: true
    },
    data: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      default: TransactionConstants.status.New,
      enum: Object.values(TransactionConstants.status)
    },
    signedTx: Object,
    transactionHash: String,
    error: Object
  },
  {
    collection: 'blockchain_txs',
    toObject: {
      virtuals: true
    },
    toJson: {
      virtuals: true
    }
  }
);

module.exports = mongoose.model('TxnBC', TransactionSchema);
