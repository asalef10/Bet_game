const Web3 = require("web3");
const GaugeWeight_ABI = require("../artifacts/GaugeWeightABI.json");
const KEY_WALLET = process.env.KEY_WALLET;
const HDWalletProvider = require("@truffle/hdwallet-provider");

const provider = new HDWalletProvider(
  KEY_WALLET,
  "https://rpc-mumbai.maticvigil.com"
);
const web3 = new Web3(provider);
const CONTRACT_ADDRESS = "0x1dC4B7f971AfD1195f94cc57c85987223d940aC4";
let gaugeWeight_Instance = new web3.eth.Contract(
  GaugeWeight_ABI,
  CONTRACT_ADDRESS
);

class GaugeWeightContract {
  async setWeight(gaugeAddress, weight) {
    try {
      const accounts = await web3.eth.getAccounts();
      await gaugeWeight_Instance.methods
        .setWeight(gaugeAddress, weight)
        .send({ from: accounts[0] });
      console.log(`Weight of gauge ${gaugeAddress} set to ${weight}`);
    } catch (error) {
      console.error(`Failed to set weight of gauge ${gaugeAddress}: ${error}`);
    }
  }

  async getWeight(gaugeAddress) {
    try {
      const weight = await gaugeWeight_Instance.methods
        .getWeight(gaugeAddress)
        .call();
      console.log(`Weight of gauge ${gaugeAddress} is ${weight}`);
      return weight;
    } catch (error) {
      console.error(`Failed to get weight of gauge ${gaugeAddress}: ${error}`);
    }
  }
}
module.exports = new GaugeWeightContract();
