const {create} = require('ipfs-http-client');
const ethers = require('ethers');
const config = require('config');

const ipfs = create({
  url: config.get('services.ipfs')
});

const createSignature = async () => {
  const signatureData = Date.now();
  const wallet = new ethers.Wallet(config.get('app.privateKey'));
  const signature = await wallet.signMessage(signatureData.toString());
  return `${signatureData}.${signature}`;
};

const addFileToIpfs = async file =>
  ipfs.add(file, {
    headers: {
      'rs-signature': await createSignature()
    }
  });

module.exports = {
  ipfs,
  addFileToIpfs,
  createSignature
};
