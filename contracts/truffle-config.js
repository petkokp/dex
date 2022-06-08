require('dotenv').config({ path: '../.env' });

const HDWalletProvider = require('@truffle/hdwallet-provider');

const privateKey = process.env.PRIVATE_KEY;

const endpoint = process.env.INFURA_ENDPOINT;

module.exports = {
  contracts_build_directory: '../src/contracts',
  networks: {
    development: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '*',
    },
    kovan: {
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
