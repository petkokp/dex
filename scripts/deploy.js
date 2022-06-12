/* eslint-disable linebreak-style */
/* eslint-disable indent */
const { ethers } = require("hardhat");

const fs = require('fs');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with account: ', deployer.address);

    const balance = await deployer.getBalance();
    console.log('Account balance: ', balance.toString());

    const DexToken = await ethers.getContractFactory('DexToken');
    const token = await DexToken.deploy();
    console.log('Token address: ', token.address);

    const AutomatedMarketMaker = await ethers.getContractFactory('AutomatedMarketMaker');
    const market = await AutomatedMarketMaker.deploy();
    console.log('AMM address: ', market.address);

    const LiquidityPool = await ethers.getContractFactory('LiquidityPool');
    const lp = await LiquidityPool.deploy(token.address, market.address);
    console.log('Pool address: ', lp.address);

    //manual abi adding
    // const data = {
    //     address: token.address,
    //     abi: JSON.parse(token.interface.format('json')),
    // };
    // fs.writeFileSync('src/DexToken.json', JSON.stringify(data));
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
