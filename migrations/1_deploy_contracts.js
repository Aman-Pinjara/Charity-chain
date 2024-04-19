var MyContract = artifacts.require("MyContract");

module.exports = function(deployer) {
    deployer.deploy(MyContract);
    // Additional contracts can be deployed here
};