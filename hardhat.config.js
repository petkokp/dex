require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');

require('dotenv').config();

const INFURA = process.env.INFURA_ENDPOINT;
const key = process.env.PRIVATE_KEY;

module.exports = {
  solidity: '0.8.9',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      url: INFURA,
      accounts: [`0x${key}`],
    },
  },
  paths: {
    artifacts: './src/abis',
  },
};
