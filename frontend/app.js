let provider, signer, contract;
const contractAddress = "0x55aC56EC0102438c97c5789a5fFDea314342c0e8";
let currentAccount;

async function init() {
  const abi = await fetch("abi.json").then(res => res.json());
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, abi, signer);
}

document.getElementById("connectWallet").onclick = async () => {
  await init();
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  currentAccount = accounts[0];
  alert("Wallet Connected: " + currentAccount);
  loadSummary();
  checkAdmin();
  loadLeaderboard();
};

async function contribute() {
  const amount = document.getElementById("contributionAmount").value;
  const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
  await tx.wait();
  alert("Contribution successful!");
  loadSummary();
  loadLeaderboard();
}

async function loadSummary() {
  const [goal, raised, timeLeft, reached, withdrawn] = await contract.getCampaignSummary();
  document.getElementById("summaryData").innerHTML = `
    <p>Goal: ${ethers.utils.formatEther(goal)} CORE</p>
    <p>Raised: ${ethers.utils.formatEther(raised)} CORE</p>
    <p>Time Remaining: ${timeLeft} sec</p>
    <p>Status: ${reached ? "Goal Reached ✅" : "In Progress..."}</p>
    <p>Funds Withdrawn: ${withdrawn ? "Yes" : "No"}</p>
  `;
}

async function loadLeaderboard() {
  const contributors = await contract.getAllContributors();
  const leaderboard = document.getElementById("leaderboardList");
  leaderboard.innerHTML = "";
  for (const addr of contributors) {
    const amt = await contract.getContributorDetails(addr);
    leaderboard.innerHTML += `<li>${addr} — ${ethers.utils.formatEther(amt)} CORE</li>`;
  }
}

async function checkAdmin() {
  const owner = await contract.owner();
  if (currentAccount.toLowerCase() === owner.toLowerCase()) {
    document.getElementById("adminPanel").style.display = "block";
  }
}

async function withdrawFunds() {
  const tx = await contract.withdrawFunds();
  await tx.wait();
  alert("Funds withdrawn!");
  loadSummary();
}

async function extendDeadline() {
  const days = document.getElementById("extendDays").value;
  const tx = await contract.extendDeadline(days);
  await tx.wait();
  alert("Deadline extended!");
  loadSummary();
}

function enterApp() {
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("app").style.display = "block";
}
