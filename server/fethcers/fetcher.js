const gaugeService = require("../services/GaugeService");
const poolsService = require("../services/PoolsService");
const curveGaugeFetcher = require("../services/CurveGaugeFetcher");
const GaugeWeightContract = require("../services/WeightContract");

class GaugesFetcher {
  async fetchGauges() {
    const pools = await poolsService.getPools();
    pools.map(async (pool) => {
      let weight = await curveGaugeFetcher.fetchGaugeWeight(pool.gaugeAddress);
      let insertionResult = await gaugeService.insertGaugeWeight(
        pool.gaugeAddress,
        weight,
        pool.id
      );
      if (insertionResult) {
        await GaugeWeightContract.setWeight(pool.gaugeAddress, weight);
      }
    });
  }
}

module.exports = new GaugesFetcher();
