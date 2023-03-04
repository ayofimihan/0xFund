const { getNamedAccounts, ethers, provider } = require("hardhat");

const main = async () => {
  const sendValue = ethers.utils.parseEther("0.1");
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  const txn = await fundMe.fund({ value: sendValue });
  console.log("funding contract...");
  await txn.wait(1);
  console.log("Funded!!");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
