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

    await token.transfer(lp.address, 99_500_000);
    await token.transfer(deployer.address, 500_000);

    await token.connect(deployer).approve(lp.address, ethers.utils.parseEther('500000').toString());
    await lp.connect(deployer).deposit(ethers.utils.parseEther('300000').toString(), {
        value: ethers.utils.parseEther('3').toString(),
        gasLimit: 500_000
    });
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
