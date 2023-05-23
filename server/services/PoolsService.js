const DB = require("../DB/DB");

class PoolsService {
  async getPools() {
    const query = `SELECT p.*, g.weight
    FROM pools p
    JOIN (
      SELECT MAX(id) AS max_id, poolId
      FROM gauges_weights
      GROUP BY poolId
    ) max_g ON max_g.poolId = p.id
    JOIN gauges_weights g ON g.id = max_g.max_id
    WHERE p.id >= 1
    ORDER BY p.id ASC;
    
    `;
    const result = await DB.QueryDB(query);
    return result;
  }
}

module.exports = new PoolsService();
