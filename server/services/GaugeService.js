const DB = require("../DB/DB");
class GaugeService {
  async insertGaugeWeight(gaugeAddress, weight, poolId) {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

    let weightExist = await DB.QueryDB(`
        SELECT Weight
        FROM gauges_weights
        WHERE gaugeAddress = '${gaugeAddress}' AND weight = ${weight}
        ORDER BY Timestamp DESC
        LIMIT 1;
      `);
    if (weightExist[0] == null) {
      const insertQuery = `INSERT INTO gauges_weights (gaugeAddress, Weight, Timestamp, poolId) VALUES ('${gaugeAddress}', ${weight}, '${timestamp}', ${poolId})`;
      await DB.QueryDB(insertQuery);
      console.log(
        `Stored weight ${weight} in database at timestamp ${timestamp}`
      );
      return true;
    }
  }
}
module.exports = new GaugeService();
