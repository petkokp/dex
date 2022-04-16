// eslint-disable-next-line no-undef
const DexToken = artifacts.require('DexToken');

// eslint-disable-next-line func-names
module.exports = function (deployer) {
  deployer.deploy(DexToken);
};
