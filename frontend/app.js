// app.js
import abi from './abi.json' assert { type: 'json' };

let contractAddress = "0xb872722d611bE8f7F53090B9236D0Ba7Cb58e875"; // your Core DAO smart contract
let provider;
let signer;
let contract;
let currentAccount = null;
let ownerAddress = null;

async function connectWallet() {
    try {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            currentAccount = await signer.getAddress();
            contract = new ethers.Contract(contractAddress, abi, signer);
            ownerAddress = await contract.owner();

            document.getElementById('walletAddress').innerText = `Connected: ${currentAccount}`;
            if (currentAccount.toLowerCase() === ownerAddress.toLowerCase()) {
                document.getElementById('adminPanel').style.display = 'block';
            }
        } else {
            alert("Please install MetaMask!");
        }
    } catch (error) {
        console.error(error);
    }
}

async function contribute() {
    let amount = document.getElementById('contributeAmount').value;
    if (!amount) return alert('Enter amount!');

    try {
        let tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        alert('Contribution successful!');
    } catch (error) {
        console.error(error);
    }
}

async function getBalance() {
    try {
        let balance = await contract.getBalance();
        document.getElementById('output').innerText = `Contract Balance: ${ethers.utils.formatEther(balance)} CORE`;
    } catch (error) {
        console.error(error);
    }
}

async function getTimeRemaining() {
    try {
        let time = await contract.getTimeRemaining();
        document.getElementById('output').innerText = `Time Remaining: ${time} seconds`;
    } catch (error) {
        console.error(error);
    }
}

async function getContributorDetails() {
    let address = document.getElementById('contributorAddress').value;
    if (!address) return alert('Enter address!');

    try {
        let contribution = await contract.getContributorDetails(address);
        document.getElementById('output').innerText = `Contribution: ${ethers.utils.formatEther(contribution)} CORE`;
    } catch (error) {
        console.error(error);
    }
}

async function refund() {
    try {
        let tx = await contract.refund();
        await tx.wait();
        alert('Refund successful!');
    } catch (error) {
        console.error(error);
    }
}

async function getCampaignSummary() {
    try {
        let summary = await contract.getCampaignSummary();
        document.getElementById('output').innerText = `
Goal: ${ethers.utils.formatEther(summary.goal)} CORE
Raised: ${ethers.utils.formatEther(summary.raised)} CORE
Time Left: ${summary.timeLeft} seconds
Goal Reached: ${summary.reached}
Funds Withdrawn: ${summary.withdrawn}
        `;
    } catch (error) {
        console.error(error);
    }
}

async function listContributors() {
    try {
        let contributors = await contract.getAllContributors();
        let leaderboard = document.getElementById('leaderboardBody');
        leaderboard.innerHTML = "";

        let contributions = [];
        for (let addr of contributors) {
            let amount = await contract.getContributorDetails(addr);
            contributions.push({ address: addr, amount: ethers.utils.formatEther(amount) });
        }

        contributions.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

        contributions.forEach((c, index) => {
            let row = `<tr>
                <td>${index + 1}</td>
                <td>${c.address.slice(0, 6)}...${c.address.slice(-4)}</td>
                <td>${c.amount} CORE</td>
            </tr>`;
            leaderboard.innerHTML += row;
        });

    } catch (error) {
        console.error(error);
    }
}

// Admin Functions
async function withdrawFunds() {
    try {
        let tx = await contract.withdrawFunds();
        await tx.wait();
        alert('Funds Withdrawn!');
    } catch (error) {
        console.error(error);
    }
}

async function extendDeadline() {
    let extraDays = prompt("Enter extra days to extend:");
    if (!extraDays || isNaN(extraDays)) return alert('Invalid input!');

    try {
        let tx = await contract.extendDeadline(extraDays);
        await tx.wait();
        alert('Deadline Extended!');
    } catch (error) {
        console.error(error);
    }
}

// Auto Refresh Leaderboard every 30 sec
setInterval(() => {
    if (contract) {
        listContributors();
    }
}, 30000);

// Auto Refresh on load
window.onload = () => {
    listContributors();
};

window.connectWallet = connectWallet;
window.contribute = contribute;
window.getBalance = getBalance;
window.getTimeRemaining = getTimeRemaining;
window.getContributorDetails = getContributorDetails;
window.refund = refund;
window.getCampaignSummary = getCampaignSummary;
window.listContributors = listContributors;
window.withdrawFunds = withdrawFunds;
window.extendDeadline = extendDeadline;
