// replace payload from frontend console.

const ethers = require('ethers');
const EthCrypto = require('eth-crypto');
const axios = require('axios');
const {privateKey} = require('../config/privateKey.json');

const payload = {
  // <Qr data>
};

// address: 0x1E43683929432f609952BfB857d1eA4231A9E9b7

const run = async () => {
  const wallet = new ethers.Wallet(privateKey);
  const encryptedWalletJson = await wallet.encrypt('123123');

  const signedData = await wallet.signMessage(payload.token);
  const data = {id: payload.id, signature: signedData};

  const encrytedWallet = await EthCrypto.encryptWithPublicKey(
    payload.encryptionKey,
    encryptedWalletJson.toString()
  );
  data.encryptedWallet = EthCrypto.cipher.stringify(encrytedWallet);
  console.log(data);

  try {
    const res = await axios.post(payload.callbackUrl, data);
  } catch (e) {
    console.log(e.message);
  }
};

run();
