let contract;
let signer;
const contractAddress = "0xb872722d611bE8f7F53090B9236D0Ba7Cb58e875"; // 
const abi = [ /* Paste your ABI here */ ];

async function connectWallet() {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
        loadCampaignInfo();
    } else {
        alert("Please install MetaMask");
    }
}

async function loadCampaignInfo() {
    const goal = await contract.goalAmount();
    const raised = await contract.totalRaised();
    const timeLeft = await contract.getTimeRemaining();
    const goalReached = await contract.goalReached();

    document.getElementById("goalAmount").innerText = ethers.utils.formatEther(goal);
    document.getElementById("raisedAmount").innerText = ethers.utils.formatEther(raised);
    document.getElementById("timeLeft").innerText = timeLeft;
    document.getElementById("status").innerText = goalReached ? "Goal Reached 🎯" : "In Progress ⏳";

    checkContributor();
    loadContributors();
}

async function contribute() {
    const amount = document.getElementById("amount").value;
    if (!amount || amount <= 0) {
        alert("Enter a valid amount");
        return;
    }
    const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    alert("Contribution successful!");
    loadCampaignInfo();
}

async function withdrawFunds() {
    try {
        const tx = await contract.withdrawFunds();
        await tx.wait();
        alert("Funds withdrawn!");
        loadCampaignInfo();
    } catch (error) {
        alert("Only owner can withdraw or goal not reached");
    }
}

async function refund() {
    try {
        const tx = await contract.refund();
        await tx.wait();
        alert("Refund claimed!");
        loadCampaignInfo();
    } catch (error) {
        alert("Refund not possible");
    }
}

async function loadContributors() {
    const contributors = await contract.getAllContributors();
    const list = document.getElementById("contributorsList");
    list.innerHTML = "";
    contributors.forEach(addr => {
        const li = document.createElement("li");
        li.innerText = addr;
        list.appendChild(li);
    });
}

async function checkContributor() {
    const address = await signer.getAddress();
    const isContributed = await contract.isContributor(address);
    if (isContributed) {
        document.getElementById("userContribution").style.display = "block";
    } else {
        document.getElementById("userContribution").style.display = "none";
    }
}

document.getElementById("connectWallet").onclick = connectWallet;
document.getElementById("contributeBtn").onclick = contribute;
document.getElementById("withdrawBtn").onclick = withdrawFunds;
document.getElementById("refundBtn").onclick = refund;
