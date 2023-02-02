const verify = async (contractAddress, args) => {
  console.log("verifying contract, please wait . . .");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified✅");
    } else {
      console.log(error);
      console.error(error);
    }
  }
};

module.exports = { verify };
