// app.js

import abi from './abi.json' assert { type: 'json' };

let provider;
let signer;
let contract;

const contractAddress = '0xb872722d611bE8f7F53090B9236D0Ba7Cb58e875';

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
        document.getElementById('walletAddress').innerText = await signer.getAddress();
        alert('Wallet connected!');
    } else {
        alert('Please install MetaMask!');
    }
}

async function contribute() {
    const amount = document.getElementById('contributeAmount').value;
    if (!amount) return alert("Please enter amount!");

    try {
        const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        alert('Contribution successful!');
    } catch (err) {
        console.error(err);
        alert('Contribution failed.');
    }
}

async function getBalance() {
    const balance = await contract.getBalance();
    document.getElementById('output').innerText = `Contract Balance: ${ethers.utils.formatEther(balance)} CORE`;
}

async function withdrawFunds() {
    try {
        const tx = await contract.withdrawFunds();
        await tx.wait();
        alert('Funds withdrawn successfully!');
    } catch (err) {
        console.error(err);
        alert('Withdraw failed.');
    }
}

async function refund() {
    try {
        const tx = await contract.refund();
        await tx.wait();
        alert('Refund successful!');
    } catch (err) {
        console.error(err);
        alert('Refund failed.');
    }
}

async function getTimeRemaining() {
    const time = await contract.getTimeRemaining();
    document.getElementById('output').innerText = `Time Remaining: ${time} seconds`;
}

async function getContributorDetails() {
    const address = document.getElementById('contributorAddress').value;
    if (!address) return alert("Enter contributor address!");

    const amount = await contract.getContributorDetails(address);
    document.getElementById('output').innerText = `Contributed: ${ethers.utils.formatEther(amount)} CORE`;
}

async function extendDeadline() {
    const extraDays = prompt("Enter number of extra days to extend:");
    if (!extraDays) return;

    try {
        const tx = await contract.extendDeadline(extraDays);
        await tx.wait();
        alert(`Deadline extended by ${extraDays} days.`);
    } catch (err) {
        console.error(err);
        alert('Deadline extension failed.');
    }
}

async function getCampaignSummary() {
    const summary = await contract.getCampaignSummary();
    const text = `
        Goal: ${ethers.utils.formatEther(summary.goal)} CORE
        Raised: ${ethers.utils.formatEther(summary.raised)} CORE
        Time Left: ${summary.timeLeft} seconds
        Goal Reached: ${summary.reached}
        Funds Withdrawn: ${summary.withdrawn}
    `;
    document.getElementById('output').innerText = text;
}

async function listContributors() {
    try {
        const contributors = await contract.getAllContributors();
        const contributionsData = [];

        for (let address of contributors) {
            const amount = await contract.getContributorDetails(address);
            contributionsData.push({
                address,
                amount: parseFloat(ethers.utils.formatEther(amount))
            });
        }

        contributionsData.sort((a, b) => b.amount - a.amount); // Sort by amount

        const leaderboardBody = document.getElementById('leaderboardBody');
        leaderboardBody.innerHTML = '';

        contributionsData.forEach((contributor, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${contributor.address}</td>
                    <td>${contributor.amount.toFixed(4)} CORE</td>
                </tr>
            `;
            leaderboardBody.innerHTML += row;
        });

        document.getElementById('output').innerText = "Leaderboard loaded.";
    } catch (error) {
        console.error(error);
        alert('Failed to fetch contributors.');
    }
}

// Attach to window so HTML buttons can call them
window.connectWallet = connectWallet;
window.contribute = contribute;
window.getBalance = getBalance;
window.withdrawFunds = withdrawFunds;
window.refund = refund;
window.getTimeRemaining = getTimeRemaining;
window.getContributorDetails = getContributorDetails;
window.extendDeadline = extendDeadline;
window.getCampaignSummary = getCampaignSummary;
window.listContributors = listContributors;
