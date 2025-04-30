const CONTRACT_ADDRESS = "0x55aC56EC0102438c97c5789a5fFDea314342c0e8";
let provider, signer, contract, userAddress;

document.getElementById("enterSite").addEventListener("click", () => {
  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("app").style.display = "block";
});

document.getElementById('connectWalletBtn').addEventListener('click', async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      userAddress = await signer.getAddress();
      document.getElementById('connectWalletBtn').innerText = `Connected: ${userAddress.slice(0, 6)}...`;

      const abi = await fetch("abi.json").then(res => res.json());
      contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      await loadCampaignSummary();
      await loadLeaderboard();
      await checkAdmin();
    } catch (err) {
      console.error(err);
    }
  } else {
    window.open("https://metamask.io/download", "_blank");
  }
});

async function loadCampaignSummary() {
  const summary = await contract.getCampaignSummary();
  document.getElementById("goalAmount").innerText = ethers.utils.formatEther(summary.goal);
  document.getElementById("totalRaised").innerText = ethers.utils.formatEther(summary.raised);
  document.getElementById("timeRemaining").innerText = `${summary.timeLeft} sec`;
}

document.getElementById("contributeBtn").addEventListener("click", async () => {
  const amount = document.getElementById("contributionAmount").value;
  const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
  await tx.wait();
  alert("🎉 Contribution successful!");
  loadCampaignSummary();
  loadLeaderboard();
});

async function loadLeaderboard() {
  const addresses = await contract.getAllContributors();
  const leaderboard = [];

  for (let addr of addresses) {
    const amt = await contract.getContributorDetails(addr);
    leaderboard.push({ addr, amt: parseFloat(ethers.utils.formatEther(amt)) });
  }

  leaderboard.sort((a, b) => b.amt - a.amt);

  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";
  leaderboard.forEach(user => {
    const item = document.createElement("li");
    item.textContent = `${user.addr.slice(0, 6)}... - ${user.amt.toFixed(3)} CORE`;
    list.appendChild(item);
  });
}

async function checkAdmin() {
  const owner = await contract.owner();
  if (owner.toLowerCase() === userAddress.toLowerCase()) {
    document.getElementById("adminPanel").style.display = "block";

    document.getElementById("withdrawBtn").addEventListener("click", async () => {
      const tx = await contract.withdrawFunds();
      await tx.wait();
      alert("✅ Funds withdrawn.");
    });

    document.getElementById("extendDeadlineBtn").addEventListener("click", async () => {
      const tx = await contract.extendDeadline(2); // extend by 2 days
      await tx.wait();
      alert("⏳ Deadline extended.");
    });
  }
}
