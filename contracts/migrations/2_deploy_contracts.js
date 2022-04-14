// eslint-disable-next-line no-undef
const Contacts = artifacts.require('./Contacts.sol');

// eslint-disable-next-line func-names
module.exports = function (deployer) {
  deployer.deploy(Contacts);
};
