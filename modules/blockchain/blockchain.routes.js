const validators = require('./transaction.validators');
const controllers = require('./blockchain.controllers');

const routes = {
  list: [
    'GET',
    '/{to}',
    'List all transactions.',
  ],
  add: [
    'POST',
    '',
    'Add a new transaction.',
  ],
  getNewTransaction: [
    'GET',
    '/tosign',
    'Get a new transaction to sign',
  ],
  // updateNonce: [
  //   'GET',
  //   '/tosign/{id}',
  //   'update Nonce of new transaction',
  // ],
  sendSignedTransaction: [
    'POST',
    '/signed',
    'sends signed Transaction',

  ],

};

/**
 * Register the routes
 * @param {object} app Application.
 */
function register(app) {
  app.register({
    name: 'transactions', routes, validators, controllers,
  });
}

module.exports = register;

// const router = require('express').Router();
// const config = require('config');

// const controller = require('./blockchain.controllers');

// router.get('/transactions', (req, res, next) => {
//   controller.list()
//     .then((d) => res.json(d))
//     .catch(next);
// });

// router.post('/transactions', (req, res, next) => {
//   controller.add(req.body)
//     .then((d) => res.json(d))
//     .catch(next);
// });

// router.get('/transactions/tosign', async (req, res, next) => {
//   const { address } = req.query;
//   if (!address) return next(Error('Must send signing address'));
//   controller.getNewOne(address)
//     .then((tx) => res.json(tx))
//     .catch(next);
// });

// router.get('/transactions/tosign/:id', async (req, res, next) => {
//   const { address } = req.query;
//   if (!address) return next(Error('Must send signing address'));
//   const nonce = await controller.getNonce(address, req.params.id);
//   controller.listNew(address)
//     .then((txs) => res.json({
//       callback: `${config.get('app.url')}/api/v1/blockchain/transactions/signed`,
//       nonce,
//       transactions: txs.map((d) => ({
//         ...d.toObject(),
//         gas: d.gas || '25000',
//       })),
//     }))
//     .catch(next);
// });

// router.post('/transactions/signed', async (req, res, next) => {
//   const tx = req.body;
//   if (!tx.id) return null;
//   if (tx.accepted) {
//     if (!tx.signedTx) {
//       await controller.setError(tx.id, 'No signed data was sent.');
//     } else {
//       await controller.setSignedTx(tx.id, tx.signedTx);
//       await controller.sendTransaction(tx);
//     }
//   } else {
//     await controller.setRejected(tx.id);
//   }

//   controller.getNewOne(tx.signer)
//     .then((tnx) => res.json(tnx))
//     .catch(next);
// });

// module.exports = router;
