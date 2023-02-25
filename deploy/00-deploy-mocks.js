const { network } = require("hardhat");
const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const networkName = network.name;

  if (developmentChains.includes(networkName)) {
    log("Local chain found, deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      args: [DECIMALS, INITIAL_ANSWER],
      log: true,
    });

    log("Mocks Deployed successfully!")
    log("💀_-_-_-_-_-_-_-_-_-_-_-_-_-_-_💀")
  }
};

module.exports.tags = ["all", "mocks"]