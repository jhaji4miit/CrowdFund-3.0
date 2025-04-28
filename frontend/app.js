import abi from './abi.json' assert { type: 'json' };

let provider;
let signer;
let contract;

const contractAddress = "0x55aC56EC0102438c97c5789a5fFDea314342c0e8";

async function connectWallet() {
  try {
    if (!window.ethereum) throw new Error("Install MetaMask!");
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);

    document.getElementById('connectWallet').innerText = '🟢 Wallet Connected';
    loadCampaignSummary();
    loadLeaderboard();
  } catch (err) {
    alert("Error connecting wallet: " + err.message);
  }
}

async function loadCampaignSummary() {
  const [goal, raised, timeLeft, reached, withdrawn] = await contract.getCampaignSummary();
  document.getElementById('campaignsContainer').innerHTML = `
    <div class="campaign">
      <h3>Goal: ${ethers.utils.formatEther(goal)} CORE</h3>
      <p>Raised: ${ethers.utils.formatEther(raised)} CORE</p>
      <p>Time Left: ${timeLeft} seconds</p>
      <p>Status: ${reached ? "Goal Reached 🎉" : "In Progress 🛠"}</p>
    </div>
  `;
}

async function loadLeaderboard() {
  const contributors = await contract.getAllContributors();
  let leaderboardHTML = "";
  for (let addr of contributors) {
    let amount = await contract.getContributorDetails(addr);
    leaderboardHTML += `<div class="leaderboard-entry"><strong>${addr}</strong> - ${ethers.utils.formatEther(amount)} CORE</div>`;
  }
  document.getElementById('leaderboardContainer').innerHTML = leaderboardHTML;
}

async function contribute(amount) {
  try {
    const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    alert('✅ Contribution Successful!');
    loadCampaignSummary();
    loadLeaderboard();
  } catch (error) {
    alert('❌ Contribution Failed: ' + error.message);
  }
}

document.getElementById('connectWallet').addEventListener('click', connectWallet);
