const poolsService = require("../services/PoolsService");

const getWeight = async (req, res) => {
  try {
    let dataPools = await poolsService.getPools();
    res.status(200).json(dataPools);
  } catch (err) {
    console.log(err);
  }
};
module.exports = { getWeight };
