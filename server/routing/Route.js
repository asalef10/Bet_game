const routing = require("express").Router();
const controller = require("../controller/Controller");
routing.get("/", controller.getWeight);
module.exports = routing;
