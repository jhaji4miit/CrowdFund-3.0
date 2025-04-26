// Connect to Metamask wallet and contract

let provider;
let signer;
let contract;

const contractAddress = "YOUR_CONTRACT_ADDRESS"; // <<< Replace this
const contractABI = [ /* YOUR_ABI_HERE */ ]; // <<< Replace with your contract ABI

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
    } else {
        alert("Please install MetaMask!");
    }
}

connectWallet();

// Contribute ETH
async function contribute() {
    const amount = document.getElementById("contributionAmount").value;
    if (!amount || amount <= 0) {
        alert("Enter a valid contribution amount");
        return;
    }
    try {
        const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        alert("Contribution successful!");
    } catch (error) {
        console.error(error);
        alert("Error contributing: " + error.message);
    }
}

// Withdraw funds (Owner only)
async function withdrawFunds() {
    try {
        const tx = await contract.withdrawFunds();
        await tx.wait();
        alert("Funds withdrawn successfully!");
    } catch (error) {
        console.error(error);
        alert("Error withdrawing: " + error.message);
    }
}

// Refund if goal not reached
async function refund() {
    try {
        const tx = await contract.refund();
        await tx.wait();
        alert("Refund successful!");
    } catch (error) {
        console.error(error);
        alert("Error refunding: " + error.message);
    }
}

// Get campaign summary
async function getSummary() {
    try {
        const summary = await contract.getCampaignSummary();
        document.getElementById("goalAmount").innerText = ethers.utils.formatEther(summary.goal);
        document.getElementById("totalRaised").innerText = ethers.utils.formatEther(summary.raised);
        document.getElementById("timeRemaining").innerText = summary.timeLeft + " seconds";
        document.getElementById("goalReached").innerText = summary.reached ? "Yes" : "No";
        document.getElementById("fundsWithdrawn").innerText = summary.withdrawn ? "Yes" : "No";
    } catch (error) {
        console.error(error);
        alert("Error fetching summary: " + error.message);
    }
}

// Get your contribution amount
async function getMyContribution() {
    try {
        const address = await signer.getAddress();
        const amount = await contract.getContributorDetails(address);
        document.getElementById("myContribution").innerText = `You have contributed: ${ethers.utils.formatEther(amount)} ETH`;
    } catch (error) {
        console.error(error);
        alert("Error fetching contribution: " + error.message);
    }
}

// List all contributors
async function getContributors() {
    try {
        const contributors = await contract.getAllContributors();
        const list = document.getElementById("contributorsList");
        list.innerHTML = "";
        contributors.forEach(addr => {
            const li = document.createElement("li");
            li.textContent = addr;
            list.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        alert("Error fetching contributors: " + error.message);
    }
}
