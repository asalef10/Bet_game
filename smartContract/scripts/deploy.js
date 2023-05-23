const hre = require("hardhat");

async function main() {
  const GaugeWeight = await hre.ethers.getContractFactory("GaugeWeight");
  const gaugeWeight = await GaugeWeight.deploy();

  console.log("GaugeWeight deployed to:", gaugeWeight.address);
}

main();
