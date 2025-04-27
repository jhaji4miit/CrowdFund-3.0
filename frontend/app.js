import abi from './abi.json' assert { type: 'json' };

const contractAddress = "0xb872722d611bE8f7F53090B9236D0Ba7Cb58e875"; // Your Core DAO contract address
let contract;
let signer;
let userAddress;

// Elements
const connectWalletBtn = document.getElementById('connectWallet');
const contributeBtn = document.getElementById('contributeBtn');
const refundBtn = document.getElementById('refund');
const withdrawFundsBtn = document.getElementById('withdrawFunds');
const extendDeadlineBtn = document.getElementById('extendDeadline');
const contributeAmountInput = document.getElementById('contributeAmount');
const fundingInfo = document.getElementById('fundingInfo');
const leaderboardList = document.getElementById('leaderboardList');
const extendDaysInput = document.getElementById('extendDays');
const adminPanel = document.getElementById('adminPanel');
const loadingSpinner = document.getElementById('loadingSpinner');
const progressFill = document.getElementById('progressFill');

// Initialize ethers
async function init() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
    } else {
        alert("Please install MetaMask or Core Wallet Extension!");
    }
}

// Connect Wallet
connectWalletBtn.addEventListener('click', async () => {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = await signer.getAddress();
        alert('✅ Wallet Connected: ' + userAddress);
        checkIfOwner();
        fetchCampaignInfo();
        fetchLeaderboard();
    } catch (err) {
        console.error(err);
        alert('❌ Wallet connection failed.');
    }
});

// Check if user is owner
async function checkIfOwner() {
    const owner = await contract.owner();
    if (userAddress.toLowerCase() === owner.toLowerCase()) {
        adminPanel.style.display = "block";
    }
}

// Contribute
contributeBtn.addEventListener('click', async () => {
    try {
        const amount = ethers.utils.parseEther(contributeAmountInput.value);
        showLoader();
        const tx = await contract.contribute({ value: amount });
        await tx.wait();
        alert('✅ Contribution successful!');
        fetchCampaignInfo();
        fetchLeaderboard();
    } catch (err) {
        console.error(err);
        alert('❌ Contribution failed.');
    }
    hideLoader();
});

// Refund
refundBtn.addEventListener('click', async () => {
    try {
        showLoader();
        const tx = await contract.refund();
        await tx.wait();
        alert('✅ Refund successful!');
        fetchCampaignInfo();
        fetchLeaderboard();
    } catch (err) {
        console.error(err);
        alert('❌ Refund failed.');
    }
    hideLoader();
});

// Withdraw Funds (Owner)
withdrawFundsBtn.addEventListener('click', async () => {
    try {
        showLoader();
        const tx = await contract.withdrawFunds();
        await tx.wait();
        alert('✅ Funds withdrawn!');
        fetchCampaignInfo();
    } catch (err) {
        console.error(err);
        alert('❌ Withdraw failed.');
    }
    hideLoader();
});

// Extend Deadline (Owner)
extendDeadlineBtn.addEventListener('click', async () => {
    try {
        const days = extendDaysInput.value;
        showLoader();
        const tx = await contract.extendDeadline(days);
        await tx.wait();
        alert('✅ Deadline extended!');
        fetchCampaignInfo();
    } catch (err) {
        console.error(err);
        alert('❌ Deadline extension failed.');
    }
    hideLoader();
});

// Fetch Campaign Info
async function fetchCampaignInfo() {
    try {
        const summary = await contract.getCampaignSummary();
        const goal = ethers.utils.formatEther(summary.goal);
        const raised = ethers.utils.formatEther(summary.raised);
        const timeLeft = parseInt(summary.timeLeft);
        const reached = summary.reached;
        const withdrawn = summary.withdrawn;

        fundingInfo.innerHTML = `
            <h2>🎯 Campaign Summary</h2>
            <p><b>Goal:</b> ${goal} CORE</p>
            <p><b>Raised:</b> ${raised} CORE</p>
            <p><b>Time Left:</b> ${timeLeft > 0 ? timeLeft + 's' : '⏳ Expired'}</p>
            <p><b>Goal Reached:</b> ${reached ? '✅ Yes' : '❌ No'}</p>
            <p><b>Funds Withdrawn:</b> ${withdrawn ? '✅ Yes' : '❌ No'}</p>
        `;

        const progress = (parseFloat(raised) / parseFloat(goal)) * 100;
        progressFill.style.width = progress > 100 ? "100%" : progress + "%";

    } catch (err) {
        console.error('Error fetching campaign info', err);
    }
}

// Fetch and Display Leaderboard
async function fetchLeaderboard() {
    try {
        const contributors = await contract.getAllContributors();
        let leaderboard = [];

        for (let addr of contributors) {
            const contribution = await contract.getContributorDetails(addr);
            leaderboard.push({ address: addr, amount: ethers.utils.formatEther(contribution) });
        }

        leaderboard.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

        leaderboardList.innerHTML = "";
        leaderboard.slice(0, 10).forEach((entry, index) => {
            leaderboardList.innerHTML += `<li><b>#${index + 1}</b> ${entry.address.substring(0,6)}... : ${entry.amount} CORE</li>`;
        });
    } catch (err) {
        console.error('Error loading leaderboard', err);
    }
}

// Show/Hide Loader
function showLoader() {
    loadingSpinner.style.display = 'block';
}
function hideLoader() {
    loadingSpinner.style.display = 'none';
}

// Auto Fetch Updates Every 20 Seconds
setInterval(() => {
    if (contract) {
        fetchCampaignInfo();
        fetchLeaderboard();
    }
}, 20000);

// Initialize
init();
