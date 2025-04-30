const contractAddress = "0x55aC56EC0102438c97c5789a5fFDea314342c0e8";
let contract;
let signer;

async function init() {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const response = await fetch("abi.json");
        const abi = await response.json();
        contract = new ethers.Contract(contractAddress, abi, signer);
        loadSummary();
        loadLeaderboard();
    } else {
        alert("Please install MetaMask to use this app.");
    }
}

async function contribute() {
    const amount = document.getElementById("contributionAmount").value;
    if (!amount || isNaN(amount)) return alert("Enter a valid amount.");
    const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    alert("Thanks for contributing!");
    loadSummary();
    loadLeaderboard();
}

async function getBalance() {
    const balance = await contract.getBalance();
    alert("Contract balance: " + ethers.utils.formatEther(balance) + " ETH");
}

async function withdrawFunds() {
    try {
        const tx = await contract.withdrawFunds();
        await tx.wait();
        alert("Funds withdrawn successfully.");
    } catch (err) {
        alert("Withdraw failed: " + err.message);
    }
}

async function refund() {
    try {
        const tx = await contract.refund();
        await tx.wait();
        alert("Refund successful.");
    } catch (err) {
        alert("Refund failed: " + err.message);
    }
}

async function extendDeadline() {
    const extraDays = prompt("Enter number of extra days to extend:");
    if (!extraDays || isNaN(extraDays)) return;
    try {
        const tx = await contract.extendDeadline(parseInt(extraDays));
        await tx.wait();
        alert("Deadline extended.");
    } catch (err) {
        alert("Extension failed: " + err.message);
    }
}

async function loadSummary() {
    const [goal, raised, timeLeft, reached, withdrawn] = await contract.getCampaignSummary();
    document.getElementById("summary-data").innerHTML = `
        <p><strong>Goal:</strong> ${ethers.utils.formatEther(goal)} ETH</p>
        <p><strong>Raised:</strong> ${ethers.utils.formatEther(raised)} ETH</p>
        <p><strong>Time Left:</strong> ${timeLeft} seconds</p>
        <p><strong>Goal Reached:</strong> ${reached}</p>
        <p><strong>Funds Withdrawn:</strong> ${withdrawn}</p>
    `;
}

async function loadLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "<li>Loading...</li>";
    try {
        const contributors = await contract.getAllContributors();
        leaderboard.innerHTML = "";
        for (const addr of contributors) {
            const amount = await contract.getContributorDetails(addr);
            leaderboard.innerHTML += `<li><strong>${addr}</strong>: ${ethers.utils.formatEther(amount)} ETH</li>`;
        }
    } catch (err) {
        leaderboard.innerHTML = "<li>Error loading leaderboard</li>";
    }
}

window.onload = init;
