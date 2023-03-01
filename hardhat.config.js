require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

const goerliRPC = process.env.GOERLI_RPC_URL;
const privateKey = process.env.PRIVATE_KEY;
const coinmarketcapKey = process.env.COINMARKETCAP_KEY;
const etherscanKey = process.env.ETHERSCAN_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.7" }],
  },
  networks: {
    goerli: {
      url: goerliRPC,
      chainId: 5,
      accounts: [privateKey],
      blockConfirmations: 4,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "NGN",
    coinmarketcap: coinmarketcapKey,
    outputFile: "gasReport.txt",
  },
  etherscan: {
    apiKey: etherscanKey,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
