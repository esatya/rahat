const config = require('config');
const ethers = require('ethers');

const TxModel = require('./transaction.model');

const BC = new ethers.providers.JsonRpcProvider(config.get('blockchain.httpProvider'));
class TxController {
  add(payload) {
    payload.status = 'new';
    delete payload.signedBy;
    delete payload.transactionHash;
    delete payload.signedTx;
    delete payload.signedBy;

    // payload.status = 'pending';
    // payload.signedAccount = '0x7c0179776bb143a36c9d338f3fa6149f40baac30';
    return TxModel.create(payload);
  }

  hasPendingTransactions(signedAccount) {
    return TxModel.exists({status: 'pending', signedAccount});
  }

  async list(toAddress) {
    const tx = await TxModel.find({to: toAddress});
    console.log('TX', tx);
    return tx;
  }

  getNonce(address) {
    return BC.getTransactionCount(address);
  }

  async listNew(address, id) {
    if (!address) throw Error('You must send your signing account address');
    const hasPendingTransactions = await this.hasPendingTransactions(address);
    if (hasPendingTransactions)
      throw Error(
        'Some of the transactions you have signed earlier are still processing. Please try again after some time.'
      );

    if (id) return TxModel.find({_id: id, status: 'new'}).lean();
    return TxModel.find({status: 'new'});
  }

  async getNewOne(address) {
    const callback = `${config.get('app.url')}/api/v1/blockchain/transactions/signed`;
    const nonce = await this.getNonce(address);
    const newTxs = await this.listNew(address);
    const totalTransactions = newTxs.length;
    if (!newTxs.length) {
      return {
        callback,
        nonce,
        totalTransactions,
        transaction: null
      };
    }

    const transaction = newTxs[0].toObject();
    transaction.nonce = nonce;
    transaction.gas = transaction.gas || '25000';
    return {
      callback,
      totalTransactions,
      transaction
    };
  }

  listSigned() {
    return TxModel.find({status: 'signed'});
  }

  async sendTransaction(transaction) {
    try {
      await TxModel.findByIdAndUpdate(transaction.id, {status: 'pending'});
      await BC.sendTransaction(transaction.signedTx);
      return this.setReceipt(transaction.id);
    } catch (e) {
      return this.setError(transaction.id, e.error.message);
    }
  }

  setRejected(id) {
    return TxModel.findByIdAndUpdate(id, {status: 'rejected'});
  }

  setError(id, error) {
    return TxModel.findByIdAndUpdate(id, {error, status: 'error'});
  }

  setSignedTx(id, signedTx) {
    const tx = ethers.utils.parseTransaction(signedTx);
    return TxModel.findByIdAndUpdate(id, {
      transactionHash: tx.hash,
      signedTx,
      signedBy: tx.from,
      status: 'signed'
    });
  }

  setReceipt(id) {
    return TxModel.findByIdAndUpdate(id, {status: 'complete'});
  }
}

const txController = new TxController();
const opts = (req, h) => ({req, res: h.response, currentUser: req.CurrentUser});
module.exports = {
  txController,
  list: req => txController.list(req.params.to),
  add: (req, h) => txController.add(req.payload)
};
