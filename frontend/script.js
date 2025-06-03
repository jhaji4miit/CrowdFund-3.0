let contract;
let signer;
const contractAddress = "0xYourContractAddressHere"; // Replace with your address

async function enterApp() {
  document.getElementById("welcomeScreen").classList.add("hidden");
  document.getElementById("mainApp").classList.remove("hidden");
}

document.getElementById("connectBtn").onclick = async () => {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);

    const owner = await contract.owner();
    const address = await signer.getAddress();
    if (owner.toLowerCase() === address.toLowerCase()) {
      document.getElementById("adminSection").classList.remove("hidden");
    }

    loadStats();
  } else {
    alert("Install MetaMask");
  }
};

async function loadStats() {
  const [goal, raised, timeLeft, reached, withdrawn] = await contract.getCampaignSummary();
  const top = await contract.getTopContributor();
  const user = await signer.getAddress();
  const myAmount = await contract.getContributorDetails(user);

  document.getElementById("goalAmount").textContent = ethers.utils.formatEther(goal);
  document.getElementById("raisedAmount").textContent = ethers.utils.formatEther(raised);
  document.getElementById("timeLeft").textContent = `${Math.floor(timeLeft / 60)} mins`;
  document.getElementById("topContributor").textContent = top[0];
  document.getElementById("userContribution").textContent = ethers.utils.formatEther(myAmount);

  const [addresses, amounts] = await contract.getAllContributionAmounts();
  document.getElementById("contributorList").innerHTML = addresses
    .map((addr, i) => `<p>${addr}: ${ethers.utils.formatEther(amounts[i])} ETH</p>`)
    .join("");
}

async function contribute() {
  const ethValue = document.getElementById("contributionInput").value;
  const tx = await contract.contribute({ value: ethers.utils.parseEther(ethValue) });
  await tx.wait();
  loadStats();
}

async function withdrawFunds() {
  const tx = await contract.withdrawFunds();
  await tx.wait();
  loadStats();
}

async function extendDeadline() {
  const tx = await contract.extendDeadline(1); // 1 day
  await tx.wait();
  loadStats();
}

async function resetCampaign() {
  const tx = await contract.resetCampaign(ethers.utils.parseEther("5"), 7);
  await tx.wait();
  loadStats();
}

async function transferOwnership() {
  const newOwner = document.getElementById("newOwner").value;
  const tx = await contract.transferOwnership(newOwner);
  await tx.wait();
  loadStats();
}
