const Web3 = require("web3");
const GAUGE_ABI = require("../artifacts/GaugesAbi.json");
const KEY_INFURA = process.env.KEY_INFURA;
const provider = `https://mainnet.infura.io/v3/${KEY_INFURA}`;
const web3 = new Web3(provider);

class CurveGaugeFetcher {
  async fetchGaugeWeight(gaugeAddress) {
    try {
      const gaugeContract = await new web3.eth.Contract(
        GAUGE_ABI,
        process.env.CURVE_GAUGE_CONTROLLER
      );
      const weight = await gaugeContract.methods
        .gauge_relative_weight(gaugeAddress)
        .call();
      return weight;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

module.exports = new CurveGaugeFetcher();
