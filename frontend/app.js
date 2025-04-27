import abi from './abi.json' assert { type: 'json' };

const contractAddress = "0xb872722d611bE8f7F53090B9236D0Ba7Cb58e875"; // ✅ Your Core DAO deployed contract
const CORE_CHAIN_ID = '0x45C'; // 1116 in hexadecimal

let contract;
let signer;
let provider;

const connectButton = document.getElementById('connectButton');
const contributeButton = document.getElementById('contributeButton');

connectButton.addEventListener('click', connectWallet);
contributeButton.addEventListener('click', contribute);

async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CORE_CHAIN_ID }],
      });

      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, abi, signer);

      const accounts = await provider.send("eth_requestAccounts", []);
      console.log("Connected account:", accounts[0]);

      alert("Wallet connected successfully!");

      loadCampaignSummary();
    } catch (error) {
      console.error('Error connecting to Core DAO network:', error);
      alert('Please connect to Core DAO Network in Metamask.');
    }
  } else {
    alert('Please install MetaMask!');
  }
}

async function loadCampaignSummary() {
  if (!contract) return;

  const summary = await contract.getCampaignSummary();
  const [goal, raised, timeLeft, reached, withdrawn] = summary;

  document.getElementById('goalAmount').innerText = ethers.utils.formatEther(goal);
  document.getElementById('totalRaised').innerText = ethers.utils.formatEther(raised);
  document.getElementById('timeRemaining').innerText = timeLeft.toString();
  document.getElementById('goalReached').innerText = reached ? "Yes" : "No";
  document.getElementById('fundsWithdrawn').innerText = withdrawn ? "Yes" : "No";
}

async function contribute() {
  if (!contract) {
    alert('Connect wallet first.');
    return;
  }

  const amount = document.getElementById('contributionAmount').value;
  if (amount <= 0) {
    alert('Enter a valid amount.');
    return;
  }

  try {
    const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    alert('Contribution successful!');

    loadCampaignSummary();
  } catch (error) {
    console.error('Contribution failed:', error);
    alert('Transaction failed.');
  }
}
