import abi from './abi.json' assert { type: 'json' };

const contractAddress = "0xb872722d611bE8f7F53090B9236D0Ba7Cb58e875";
const CORE_CHAIN_ID = '0x45C'; // 1116 in hex

let contract;
let signer;
let provider;

document.getElementById('connectButton').onclick = connectWallet;
document.getElementById('contributeButton').onclick = contribute;
document.getElementById('withdrawButton').onclick = withdrawFunds;
document.getElementById('refundButton').onclick = refund;
document.getElementById('extendDeadlineButton').onclick = extendDeadline;
document.getElementById('checkContributionButton').onclick = getContributorDetails;
document.getElementById('listContributorsButton').onclick = listContributors;

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

      alert("Wallet connected successfully!");
      loadCampaignSummary();
    } catch (error) {
      console.error(error);
      alert('Please connect to Core DAO network.');
    }
  } else {
    alert('Install MetaMask!');
  }
}

async function loadCampaignSummary() {
  const summary = await contract.getCampaignSummary();
  const [goal, raised, timeLeft, reached, withdrawn] = summary;

  document.getElementById('goalAmount').innerText = ethers.utils.formatEther(goal);
  document.getElementById('totalRaised').innerText = ethers.utils.formatEther(raised);
  document.getElementById('timeRemaining').innerText = timeLeft.toString();
  document.getElementById('goalReached').innerText = reached ? "Yes" : "No";
  document.getElementById('fundsWithdrawn').innerText = withdrawn ? "Yes" : "No";
}

async function contribute() {
  const amount = document.getElementById('contributionAmount').value;
  if (amount <= 0) return alert('Enter valid amount.');

  try {
    const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    alert('Contribution successful!');
    loadCampaignSummary();
  } catch (error) {
    console.error(error);
    alert('Contribution failed.');
  }
}

async function withdrawFunds() {
  try {
    const tx = await contract.withdrawFunds();
    await tx.wait();
    alert('Funds withdrawn successfully!');
    loadCampaignSummary();
  } catch (error) {
    console.error(error);
    alert('Withdraw failed or not owner.');
  }
}

async function refund() {
  try {
    const tx = await contract.refund();
    await tx.wait();
    alert('Refund successful!');
    loadCampaignSummary();
  } catch (error) {
    console.error(error);
    alert('Refund failed.');
  }
}

async function extendDeadline() {
  const extraDays = document.getElementById('extendDays').value;
  if (extraDays <= 0) return alert('Enter valid days.');

  try {
    const tx = await contract.extendDeadline(extraDays);
    await tx.wait();
    alert('Deadline extended!');
    loadCampaignSummary();
  } catch (error) {
    console.error(error);
    alert('Extension failed.');
  }
}

async function getContributorDetails() {
  const address = document.getElementById('contributorAddress').value;
  if (!ethers.utils.isAddress(address)) return alert('Invalid address.');

  try {
    const contribution = await contract.getContributorDetails(address);
    document.getElementById('output').innerText = 
      `Contribution by ${address}: ${ethers.utils.formatEther(contribution)} CORE`;
  } catch (error) {
    console.error(error);
    alert('Failed to fetch contribution.');
  }
}

async function listContributors() {
  try {
    const contributors = await contract.getAllContributors();
    document.getElementById('output').innerText = 
      "Contributors:\n" + contributors.join('\n');
  } catch (error) {
    console.error(error);
    alert('Failed to fetch contributors.');
  }
}
