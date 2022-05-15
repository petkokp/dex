// eslint-disable-next-line no-undef
const DexToken = artifacts.require('DexToken');
const AutomatedMarketMaker = artifacts.require('AMM');
const LiquidityPool = artifacts.require('LiquidityPool');

// eslint-disable-next-line func-names
module.exports = function (deployer) {
  deployer.deploy(DexToken);
  deployer.deploy(AutomatedMarketMaker);
  deployer.deploy(LiquidityPool);
};
