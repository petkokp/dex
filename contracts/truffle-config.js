const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config({ path: '../.env' });

const privateKey = process.env.PRIVATE_KEY;

const endpoint = process.env.INFURA_ENDPOINT;

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    kovan: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () => new HDWalletProvider({
        privateKeys: [privateKey],
        providerOrUrl: endpoint,
      }),
      network_id: 42,
    },
  },
  compilers: {
    solc: {
      version: '0.8.10',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
