const { deployments, getNamedAccounts, ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("FundMe", async () => {
  let fundMe;
  let MockV3Aggregator;

  beforeEach(async () => {
    const { deployer } = await getNamedAccounts();
    await deployments.fixture(["all"]);
    fundMe = await ethers.getContract("FundMe", deployer);
    MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });
  describe("Constructor", async () => {
    it("should check if constructor is set correctly", async () => {
      const response = await fundMe.priceFeed();
      assert.equal(response, MockV3Aggregator.address);
    });
  });
  describe("fund", async () => {
    it("the txn should fail cos no args passed", async () => {
      expect(fundMe.fund()).to.be.reverted;
    });
  });
});
