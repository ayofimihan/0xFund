const { deployments, getNamedAccounts, ethers } = require("hardhat");
const { assert, expect } = require("chai");

const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async () => {
      let fundMe;
      let MockV3Aggregator;
      const sendValue = ethers.utils.parseEther("1");

      beforeEach(async () => {
        const { deployer } = await getNamedAccounts();
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        MockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
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
        it("should update funderToAmount mapping", async () => {
          const { deployer } = await getNamedAccounts();
          const sendValue = ethers.utils.parseEther("1");
          await fundMe.fund({ value: sendValue });
          const txn = await fundMe.funderToAmount(deployer);
          assert.equal(txn.toString(), sendValue);
        });
        it("should add funders to an array", async () => {
          const { deployer } = await getNamedAccounts();
          await fundMe.fund({ value: sendValue });
          const firstFunder = await fundMe.funders(0);
          assert.equal(firstFunder, deployer);
        });
      });

      describe("withdraw", async () => {
        beforeEach(async () => {
          await fundMe.fund({ value: sendValue });
        });
        it("should be able to withdraw from single funder", async () => {
          const { deployer } = await getNamedAccounts();
          const contractBefore = await fundMe.provider.getBalance(
            fundMe.address
          );
          const deployerBefore = await fundMe.provider.getBalance(deployer);

          const txn = await fundMe.withdraw(deployer);
          const receipt = await txn.wait(1);
          const { gasUsed, effectiveGasPrice } = await receipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const contractAfter = await fundMe.provider.getBalance(
            fundMe.address
          );
          const deployerAfter = await fundMe.provider.getBalance(deployer);

          assert.equal(contractAfter, 0);
          assert.equal(
            contractBefore.add(deployerBefore).toString(),
            deployerAfter.add(gasCost).toString()
          );
        });

        it("should withdraw from multiple funders", async () => {
          const accounts = await ethers.getSigners();
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = fundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: sendValue });
          }

          const { deployer } = await getNamedAccounts();
          const contractBefore = await fundMe.provider.getBalance(
            fundMe.address
          );
          const deployerBefore = await fundMe.provider.getBalance(deployer);

          const txn = await fundMe.withdraw(deployer);
          const receipt = await txn.wait(1);
          const { gasUsed, effectiveGasPrice } = await receipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const contractAfter = await fundMe.provider.getBalance(
            fundMe.address
          );
          const deployerAfter = await fundMe.provider.getBalance(deployer);

          assert.equal(contractAfter, 0);
          assert.equal(
            contractBefore.add(deployerBefore).toString(),
            deployerAfter.add(gasCost).toString()
          );
          await expect(fundMe.funders(0)).to.be.reverted;
          for (let i = 1; i < 6; i++) {
            assert.equal(await fundMe.funderToAmount(accounts[i].address), 0);
          }
        });

        it("should only allow owner to withdraw", async () => {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const attackerConnectedContract = await fundMe.connect(attacker);
          expect(attackerConnectedContract.withdraw(attacker.address)).to.be
            .reverted;
        });
      });
    });
