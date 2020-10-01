const KingToken = artifacts.require("./KingToken.sol");

module.exports = function (deployer) {
  deployer.deploy(KingToken);
};