// Import ABI and connect to Smart Contract
import abi from './abi.json';

let provider;
let signer;
let contract;

// Contract address
const contractAddress = "0x55aC56EC0102438c97c5789a5fFDea314342c0e8";

// Connect to wallet and initialize
async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);

        document.getElementById('walletAddress').innerText = await signer.getAddress();
        loadCampaignSummary();
        loadLeaderboard();
        setInterval(loadLeaderboard, 30000); // Auto refresh every 30 seconds
    } else {
        alert("Please install MetaMask to use this app!");
    }
}

// Load basic campaign summary
async function loadCampaignSummary() {
    try {
        const summary = await contract.getCampaignSummary();
        document.getElementById('goalAmount').innerText = ethers.utils.formatEther(summary.goal) + " CORE";
        document.getElementById('totalRaised').innerText = ethers.utils.formatEther(summary.raised) + " CORE";
        document.getElementById('timeRemaining').innerText = summary.timeLeft > 0 ? `${(summary.timeLeft / 3600).toFixed(2)} hrs` : "Expired";
        document.getElementById('goalReached').innerText = summary.reached ? "✅ Yes" : "❌ No";
        document.getElementById('fundsWithdrawn').innerText = summary.withdrawn ? "✅ Yes" : "❌ No";
    } catch (error) {
        console.error("Error loading summary:", error);
    }
}

// Contribute function
async function contribute() {
    const amount = document.getElementById('contributionAmount').value;
    if (!amount) return alert("Enter an amount to contribute!");

    try {
        const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        alert("Thanks for contributing!");
        document.getElementById('contributionAmount').value = "";
        loadCampaignSummary();
        loadLeaderboard();
    } catch (error) {
        console.error("Contribution failed:", error);
        alert("Transaction Failed!");
    }
}

// Leaderboard function
async function loadLeaderboard() {
    const leaderboardTable = document.getElementById("leaderboardTableBody");
    leaderboardTable.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    try {
        const addresses = await contract.getAllContributors();

        const contributors = await Promise.all(
            addresses.map(async (addr) => {
                const amount = await contract.getContributorDetails(addr);
                return { address: addr, amount: parseFloat(ethers.utils.formatEther(amount)) };
            })
        );

        contributors.sort((a, b) => b.amount - a.amount);

        leaderboardTable.innerHTML = "";

        contributors.forEach((contributor, index) => {
            const row = document.createElement("tr");
            let badge = "";
            if (index === 0) badge = "🥇";
            else if (index === 1) badge = "🥈";
            else if (index === 2) badge = "🥉";

            row.innerHTML = `
                <td>${badge} #${index + 1}</td>
                <td>${contributor.address.slice(0, 6)}...${contributor.address.slice(-4)}</td>
                <td>${contributor.amount.toFixed(4)} CORE</td>
            `;
            row.classList.add('fade-in');
            leaderboardTable.appendChild(row);
        });

        if (contributors.length === 0) {
            leaderboardTable.innerHTML = "<tr><td colspan='3'>No contributors yet.</td></tr>";
        }
    } catch (error) {
        console.error("Failed to load leaderboard:", error);
        leaderboardTable.innerHTML = "<tr><td colspan='3'>Error loading leaderboard.</td></tr>";
    }
}

// Withdraw funds (Owner only)
async function withdrawFunds() {
    try {
        const tx = await contract.withdrawFunds();
        await tx.wait();
        alert("Funds withdrawn successfully!");
        loadCampaignSummary();
    } catch (error) {
        console.error("Withdraw failed:", error);
        alert("Withdraw Failed!");
    }
}

// Refund if campaign failed
async function requestRefund() {
    try {
        const tx = await contract.refund();
        await tx.wait();
        alert("Refund successful!");
        loadCampaignSummary();
    } catch (error) {
        console.error("Refund failed:", error);
        alert("Refund Failed or Not eligible!");
    }
}

// On page load, connect wallet
window.onload = function() {
    connectWallet();
};

