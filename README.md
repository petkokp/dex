# Setup

1. Install Truffle - `npm install -g truffle`
(you can install Ganache with `npm install -g ganache` and start it with `ganache` but you will have to change the port in truffle.config.js development network from 7545 to 8545)
2. Install MetaMask browser extension
3. Connect MetaMask to Ganache - https://asifwaquar.com/connect-metamask-to-localhost/

https://betterprogramming.pub/blockchain-introduction-using-real-world-dapp-react-solidity-web3-js-546471419955

# Start React app

1. `npm start`

# Setup local blockchain environment

1. `cd contracts`
2. Run `truffle develop` to start local blockchain environment
3. Test contracts with `truffle test`
4. Deploy contracts to local network with `truffle migrate`