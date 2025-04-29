// app.js

let provider;
let signer;
let contract;

const contractAddress = "0x55aC56EC0102438c97c5789a5fFDea314342c0e8";

// Fetch ABI from abi.json
async function loadContract() {
    const response = await fetch('/abi.json');
    const abi = await response.json();

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
}

async function connectWallet() {
    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        await loadContract();
        alert("✅ Wallet Connected Successfully!");
    } catch (error) {
        console.error(error);
        alert("❌ Wallet Connection Failed!");
    }
}

async function contribute() {
    const amount = document.getElementById("contributionAmount").value;
    if (!amount || isNaN(amount)) {
        alert("Please enter a valid contribution amount.");
        return;
    }

    try {
        const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        alert("✅ Contribution successful!");
        fetchSummary(); // Refresh dashboard
    } catch (error) {
        console.error(error);
        alert("❌ Contribution failed!");
    }
}

async function getBalance() {
    try {
        const balance = await contract.getBalance();
        document.getElementById("balance").innerText = `Contract Balance: ${ethers.utils.formatEther(balance)} ETH`;
    } catch (error) {
        console.error(error);
    }
}

async function fetchSummary() {
    try {
        const summary = await contract.getCampaignSummary();
        document.getElementById("goalAmount").innerText = `${ethers.utils.formatEther(summary.goal)} ETH`;
        document.getElementById("raisedAmount").innerText = `${ethers.utils.formatEther(summary.raised)} ETH`;
        document.getElementById("timeLeft").innerText = `${summary.timeLeft} seconds`;
        document.getElementById("goalStatus").innerText = summary.reached ? "Goal Reached 🎯" : "Goal Not Reached ❌";
    } catch (error) {
        console.error(error);
    }
}

async function withdrawFunds() {
    try {
        const tx = await contract.withdrawFunds();
        await tx.wait();
        alert("✅ Funds withdrawn successfully!");
        fetchSummary();
    } catch (error) {
        console.error(error);
        alert("❌ Withdrawal failed!");
    }
}

async function refund() {
    try {
        const tx = await contract.refund();
        await tx.wait();
        alert("✅ Refund successful!");
        fetchSummary();
    } catch (error) {
        console.error(error);
        alert("❌ Refund failed!");
    }
}

async function getAllContributors() {
    try {
        const contributors = await contract.getAllContributors();
        const leaderboard = document.getElementById("leaderboard");
        leaderboard.innerHTML = "";
        
        for (let address of contributors) {
            const amount = await contract.getContributorDetails(address);
            const item = document.createElement("li");
            item.textContent = `${address} - ${ethers.utils.formatEther(amount)} ETH`;
            leaderboard.appendChild(item);
        }
    } catch (error) {
        console.error(error);
    }
}

async function extendDeadline() {
    const extraDays = prompt("Enter number of extra days:");
    if (!extraDays || isNaN(extraDays)) {
        alert("Invalid number of days.");
        return;
    }

    try {
        const tx = await contract.extendDeadline(extraDays);
        await tx.wait();
        alert("✅ Deadline extended successfully!");
        fetchSummary();
    } catch (error) {
        console.error(error);
        alert("❌ Deadline extension failed!");
    }
}

// Auto-fetch data on load
window.onload = async () => {
    if (window.ethereum) {
        await connectWallet();
        await fetchSummary();
        await getBalance();
        await getAllContributors();
    } else {
        alert("🦊 Please install MetaMask or a compatible wallet extension!");
    }
};
