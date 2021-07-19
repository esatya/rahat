const ethers = require('ethers');
const config = require('config');
const { ethersContract } = require('./contract');
const { getAbi } = require('./abi');
const { token } = require('../../config/settings.json');

const network = config.get('blockchain.httpProvider');
const provider = new ethers.providers.JsonRpcProvider(network);
const abi = getAbi('AidToken');
const { Vendor, Agency } = require('../../modules');

const listenTokenTx = async () => {
  try {
    const {
      contracts: { token: tokenAddress, rahat_admin: rahatAdmin },
    } = await Agency.getFirst();
    const filter = {
      address: tokenAddress,
      topics: [
        // the name of the event, parnetheses containing the data type of each event, no spaces
        ethers.utils.id('Transfer(address,address,uint256)'),
      ],
    };
    const tokenContract = ethersContract(abi, tokenAddress);
    provider.on(filter, async (log) => {
      const {
        args: { from, to, value },
      } = tokenContract.interface.parseLog(log);
      const vendor = await Vendor.getbyWallet(from);
      if (vendor && to === rahatAdmin) {
        await Vendor.addTokenRedemption({
          vendor_wallet: from,
          amount: value,
          tx_hash: log.transactionHash,
          success: true,
        });
      }
    });
  } catch (e) {
    throw Error(e);
  }
};

const stopListener = async () => {
  provider.removeAllListeners();
};

module.exports = { listenTokenTx, stopListener };
