require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const KEY_WALLET = process.env.KEY_WALLET;
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    polygon_testnet: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [KEY_WALLET],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_KEY,
  },
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
