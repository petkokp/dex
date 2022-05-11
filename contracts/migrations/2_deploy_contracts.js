// eslint-disable-next-line no-undef
const DexToken = artifacts.require('DexToken');
const AMM = artifacts.require('AutomatedMarketMaker');
const LP = artifacts.require('LiquidityPool');

// eslint-disable-next-line func-names
module.exports = function (deployer) {
  deployer.deploy(DexToken);
  deployer.deploy(AMM);
  deployer.deploy(LP);
};
