// Import ABI
import abi from './abi.json' assert { type: 'json' };

// Contract Address
const contractAddress = '0x55aC56EC0102438c97c5789a5fFDea314342c0e8';

// Globals
let provider;
let signer;
let contract;
let userAddress;

// Elements
const connectWalletBtn = document.getElementById('connectWallet');
const campaignsSection = document.getElementById('campaigns');
const leaderboardTable = document.getElementById('leaderboardTable');
const themeToggle = document.getElementById('themeToggle');

// 1. Connect Wallet
async function connectWallet() {
  try {
    if (!window.ethereum) {
      Swal.fire('MetaMask not found!', 'Please install MetaMask extension.', 'error');
      return;
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    contract = new ethers.Contract(contractAddress, abi, signer);

    connectWalletBtn.innerText = 'Connected ✅';
    connectWalletBtn.disabled = true;

    loadCampaigns();
    loadLeaderboard();

  } catch (error) {
    console.error(error);
    Swal.fire('Error!', 'Failed to connect wallet.', 'error');
  }
}

// 2. Load Campaigns
async function loadCampaigns() {
  try {
    const summary = await contract.getCampaignSummary();

    campaignsSection.innerHTML = `
      <div class="campaign-card">
        <h2>Goal: ${ethers.utils.formatEther(summary.goal)} CORE</h2>
        <p>Raised: ${ethers.utils.formatEther(summary.raised)} CORE</p>
        <p>Time Left: ${summary.timeLeft} seconds</p>
        <p>Goal Reached: ${summary.reached ? '✅' : '❌'}</p>
        <p>Funds Withdrawn: ${summary.withdrawn ? '✅' : '❌'}</p>
        <button onclick="contribute()">Contribute</button>
        ${summary.reached && !summary.withdrawn ? `<button onclick="withdraw()">Withdraw Funds</button>` : ''}
      </div>
    `;
  } catch (err) {
    console.error(err);
    Swal.fire('Error!', 'Cannot load campaigns.', 'error');
  }
}

// 3. Contribute
async function contribute() {
  const { value: amount } = await Swal.fire({
    title: 'Enter amount to contribute',
    input: 'number',
    inputPlaceholder: 'Amount in CORE',
    showCancelButton: true,
  });

  if (amount) {
    try {
      const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
      await tx.wait();
      Swal.fire('Success!', 'Contribution made successfully.', 'success');
      loadCampaigns();
      loadLeaderboard();
    } catch (err) {
      console.error(err);
      Swal.fire('Error!', 'Failed to contribute.', 'error');
    }
  }
}

// 4. Withdraw Funds
async function withdraw() {
  try {
    const tx = await contract.withdrawFunds();
    await tx.wait();
    Swal.fire('Success!', 'Funds withdrawn.', 'success');
    loadCampaigns();
  } catch (err) {
    console.error(err);
    Swal.fire('Error!', 'Withdraw failed.', 'error');
  }
}

// 5. Load Leaderboard
async function loadLeaderboard() {
  try {
    const contributors = await contract.getAllContributors();
    leaderboardTable.innerHTML = `
      <tr>
        <th>Rank</th>
        <th>Address</th>
        <th>Amount (CORE)</th>
      </tr>
    `;

    let data = [];
    for (let address of contributors) {
      const contribution = await contract.getContributorDetails(address);
      data.push({ address, contribution: parseFloat(ethers.utils.formatEther(contribution)) });
    }

    data.sort((a, b) => b.contribution - a.contribution);

    data.forEach((contributor, index) => {
      leaderboardTable.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${shortenAddress(contributor.address)}</td>
          <td>${contributor.contribution.toFixed(4)}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
  }
}

// 6. Theme Toggle
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

// 7. Load Preferred Theme
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  } else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }
}

// Helpers
function shortenAddress(addr) {
  return addr.substring(0, 6) + '...' + addr.slice(-4);
}

// Auto connect if already authorized
async function autoConnect() {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      connectWallet();
    }
  }
}

// Init
window.onload = () => {
  loadTheme();
  autoConnect();
};

connectWalletBtn.addEventListener('click', connectWallet);
