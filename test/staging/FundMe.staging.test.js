const { ethers, getNamedAccounts, network } = require("hardhat");
const { expect, assert } = require("chai");

const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async () => {
      let fundMe;
      let sendValue = ethers.utils.parseEther("0.1");
      beforeEach(async () => {
        fundMe = await ethers.getContract("FundMe");
      });
      it("should allow funding and wuthdrawals", async () => {
        const { deployer } = await getNamedAccounts();

        await fundMe.fund({ value: sendValue });

        await fundMe.withdraw(deployer);

        const endingBalance = await fundMe.provider.getBalance(fundMe.address);
        assert.equal(await endingBalance.toString(), "0");
      });
    });
