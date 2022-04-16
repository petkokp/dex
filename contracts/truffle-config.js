const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

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
        privateKeys: ['0xc9814423ea537bd5ff0aaf22d08a37b032a7cb6455aff950b12627f9f9ddfb4d'],
        providerOrUrl: 'https://kovan.infura.io/v3/1d4972f6179e45efbff08d17e5d658ff',
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
