/* eslint-disable no-undef */
const DexToken = artifacts.require('DexToken');
const AutomatedMarketMaker = artifacts.require('AutomatedMarketMaker');
const LiquidityPool = artifacts.require('LiquidityPool');

// eslint-disable-next-line func-names
module.exports = async function (deployer) {
  deployer.then(async () => {
    const dexToken = await DexToken.new();
    const amm = await AutomatedMarketMaker.new();
    await LiquidityPool.new(dexToken.address, amm.address);
  });
};
