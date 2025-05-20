const hre = require("hardhat");

async function main() {
  const CrowdFund = await hre.ethers.getContractFactory("CrowdFund");
  const contract = await CrowdFund.deploy(ethers.utils.parseEther("10"), 30);
  await contract.deployed();
  console.log("✅ Deployed to:", contract.address);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
