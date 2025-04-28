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
}

async function createCampaign() {
    const goalAmount = document.getElementById('goalAmount').value;
    const durationDays = document.getElementById('durationDays').value;

    if (!goalAmount || !durationDays) {
        alert('❌ Please enter valid values!');
        return;
    }

    try {
        const tx = await contract.constructor(ethers.utils.parseEther(goalAmount), durationDays);
        await tx.wait();
        alert('✅ Campaign Created Successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        alert('❌ Failed to create campaign: ' + error.message);
    }
}

document.getElementById('connectWallet').addEventListener('click', connectWallet);
