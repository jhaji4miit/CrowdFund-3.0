import abi from './abi.json' assert { type: 'json' };

let provider;
let signer;
let contract;

const contractAddress = "0x55aC56EC0102438c97c5789a5fFDea314342c0e8";

async function connectWallet() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);

    document.getElementById('connectWallet').innerText = '🟢 Wallet Connected';
    loadCampaignDetails();
}

async function loadCampaignDetails() {
    const [goal, raised, timeLeft, reached, withdrawn] = await contract.getCampaignSummary();
    document.getElementById('campaignDetails').innerHTML = `
      <div class="campaign">
        <h3>Goal: ${ethers.utils.formatEther(goal)} CORE</h3>
        <p>Raised: ${ethers.utils.formatEther(raised)} CORE</p>
        <p>Time Left: ${timeLeft} seconds</p>
        <p>Status: ${reached ? "Goal Reached 🎉" : "In Progress 🛠"}</p>
        <p>Funds Withdrawn: ${withdrawn ? "Yes" : "No"}</p>
      </div>
    `;
}

async function makeContribution() {
    const amount = document.getElementById('contributionAmount').value;
    try {
        const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        alert('✅ Contribution Successful!');
        loadCampaignDetails();
    } catch (error) {
        alert('❌ Failed to contribute: ' + error.message);
    }
}

async function withdrawFunds() {
    try {
        const tx = await contract.withdrawFunds();
        await tx.wait();
        alert('✅ Withdrawal Successful!');
        loadCampaignDetails();
    } catch (error) {
        alert('❌ Withdrawal Failed: ' + error.message);
    }
}

async function requestRefund() {
    try {
        const tx = await contract.refund();
        await tx.wait();
        alert('✅ Refund Successful!');
    } catch (error) {
        alert('❌ Refund Failed: ' + error.message);
    }
}

document.getElementById('connectWallet').addEventListener('click', connectWallet);
