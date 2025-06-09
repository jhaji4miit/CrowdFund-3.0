const hre = require("hardhat");

async function main() {
  const goalAmount = hre.ethers.utils.parseEther("10"); // 10 ETH goal
  const durationInDays = 7; // 7-day campaign

  const CrowdFund = await hre.ethers.getContractFactory("CrowdFund");
  const crowdFund = await CrowdFund.deploy(goalAmount, durationInDays);

  await crowdFund.deployed();
  console.log("CrowdFund deployed to:", crowdFund.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });
