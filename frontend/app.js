// app.js (Updated with Welcome Screen Logic, Full Smart Contract Integration, Real-time Leaderboard)

const CONTRACT_ADDRESS = "0x55aC56EC0102438c97c5789a5fFDea314342c0e8";
let contract;
let provider;
let signer;

window.addEventListener('DOMContentLoaded', async () => {
  showWelcomeScreen();
  await initializeApp();
});

function showWelcomeScreen() {
  const welcomeScreen = document.getElementById("welcome-screen");
  const appContainer = document.getElementById("app-container");
  setTimeout(() => {
    welcomeScreen.style.display = "none";
    appContainer.style.display = "block";
  }, 3000);
}

async function initializeApp() {
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    const response = await fetch("abi.json");
    const abi = await response.json();
    contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    document.getElementById("wallet-address").innerText = `Connected: ${await signer.getAddress()}`;

    setupUI();
    updateLeaderboard();
  } else {
    alert("MetaMask not detected. Please install it to use this app.");
  }
}

function setupUI() {
  document.getElementById("contribute-btn").onclick = async () => {
    const amount = document.getElementById("contribution-amount").value;
    if (!amount || isNaN(amount)) return alert("Enter a valid amount");

    const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    alert("Contribution successful!");
    updateLeaderboard();
  };

  document.getElementById("withdraw-btn").onclick = async () => {
    const tx = await contract.withdrawFunds();
    await tx.wait();
    alert("Funds withdrawn by owner");
  };

  document.getElementById("refund-btn").onclick = async () => {
    const tx = await contract.refund();
    await tx.wait();
    alert("Refund processed");
  };

  document.getElementById("extend-deadline-btn").onclick = async () => {
    const days = prompt("Enter number of days to extend deadline:");
    if (days && !isNaN(days)) {
      const tx = await contract.extendDeadline(parseInt(days));
      await tx.wait();
      alert("Deadline extended");
    }
  };
}

async function updateLeaderboard() {
  const leaderboard = document.getElementById("leaderboard");
  leaderboard.innerHTML = "Loading...";
  try {
    const contributors = await contract.getAllContributors();
    let rows = await Promise.all(contributors.map(async (addr) => {
      const amount = await contract.getContributorDetails(addr);
      return { addr, amount: parseFloat(ethers.utils.formatEther(amount)) };
    }));

    rows.sort((a, b) => b.amount - a.amount);

    leaderboard.innerHTML = rows.map((row, idx) => `
      <div>
        <strong>#${idx + 1}</strong> ${row.addr.substring(0, 6)}...${row.addr.slice(-4)} — ${row.amount} CORE
      </div>
    `).join('');
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    leaderboard.innerHTML = "Error loading leaderboard.";
  }
}
