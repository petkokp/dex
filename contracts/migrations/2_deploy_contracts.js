/* eslint-disable no-undef */
const DexToken = artifacts.require('DexToken');
const AutomatedMarketMaker = artifacts.require('AutomatedMarketMaker');
const PriceConsumer = artifacts.require('PriceConsumer');
const LiquidityPool = artifacts.require('LiquidityPool');

module.exports = async (deployer) => {
  deployer.then(async () => {
    const dexToken = await DexToken.new();
    const priceConsumer = await PriceConsumer.new('0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507' /* ETH-USD on Ropsten */);
    const amm = await AutomatedMarketMaker.new(priceConsumer.address);
    await LiquidityPool.new(dexToken.address, amm.address);
  });
};
