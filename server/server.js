require("dotenv").config();
const appRouting = require("./routing/Route");
const express = require("express");
const app = express();
const cors = require("cors");
const fetcher = require("./fethcers/fetcher");
const cron = require("node-cron");

app.use(cors());
app.use("/", appRouting);
cron.schedule("* */1 * * *", fetcher.fetchGauges);
app.listen(3000, async (err) => {
  if (err) {
    console.log(err);
  }
   console.log("listening on port 3000");
});
