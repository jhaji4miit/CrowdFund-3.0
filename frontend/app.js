import abi from './abi.json' assert { type: 'json' };

const CONTRACT_ADDRESS = '0xb872722d611bE8f7F53090B9236D0Ba7Cb58e875';
let provider, signer, contract, userAddress;

const connectWallet = async () => {
  try {
    if (!window.ethereum) throw new Error('Please install MetaMask!');

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    alert(`✅ Wallet connected: ${userAddress.slice(0,6)}...${userAddress.slice(-4)}`);
    checkAdmin();
    autoRefresh();
  } catch (error) {
    console.error(error);
    alert('❌ Wallet connection failed.');
  }
};

const checkAdmin = async () => {
  const owner = await contract.owner();
  if (userAddress.toLowerCase() === owner.toLowerCase()) {
    document.getElementById('admin-section').style.display = 'block';
  } else {
    document.getElementById('admin-section').style.display = 'none';
  }
};

const contribute = async () => {
  try {
    const amount = document.getElementById('amount').value;
    if (!amount || parseFloat(amount) <= 0) return alert('Enter valid amount.');

    const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    alert('🎯 Contribution successful!');
    loadLeaderboard();
    loadSummary();
  } catch (error) {
    console.error(error);
    alert('❌ Contribution failed.');
  }
};

const loadSummary = async () => {
  try {
    const summary = await contract.getCampaignSummary();
    document.getElementById('summary').innerText = `
Goal: ${ethers.utils.formatEther(summary.goal)} CORE
Raised: ${ethers.utils.formatEther(summary.raised)} CORE
Time Left: ${formatTime(summary.timeLeft)}
Goal Reached: ${summary.reached}
Funds Withdrawn: ${summary.withdrawn}
    `;
  } catch (error) {
    console.error(error);
  }
};

const loadLeaderboard = async () => {
  try {
    const addresses = await contract.getAllContributors();
    let leaderboard = '';

    for (let addr of addresses) {
      const amount = await contract.getContributorDetails(addr);
      leaderboard += `${shortAddress(addr)} - ${ethers.utils.formatEther(amount)} CORE\n`;
    }

    document.getElementById('leaderboard').innerText = leaderboard || 'No contributors yet!';
  } catch (error) {
    console.error(error);
  }
};

const refund = async () => {
  try {
    const tx = await contract.refund();
    await tx.wait();
    alert('💸 Refund Successful!');
  } catch (error) {
    console.error(error);
    alert('❌ Refund failed.');
  }
};

const withdrawFunds = async () => {
  try {
    const tx = await contract.withdrawFunds();
    await tx.wait();
    alert('💰 Funds withdrawn!');
    loadSummary();
  } catch (error) {
    console.error(error);
    alert('❌ Withdraw failed.');
  }
};

const extendDeadline = async () => {
  try {
    const extraDays = document.getElementById('extraDays').value;
    if (!extraDays || parseInt(extraDays) <= 0) return alert('Enter valid extra days.');

    const tx = await contract.extendDeadline(extraDays);
    await tx.wait();
    alert('🗓️ Deadline extended!');
    loadSummary();
  } catch (error) {
    console.error(error);
    alert('❌ Extension failed.');
  }
};

const getContribution = async () => {
  try {
    const address = document.getElementById('contributorAddress').value;
    if (!ethers.utils.isAddress(address)) return alert('Invalid address.');
    
    const amount = await contract.getContributorDetails(address);
    document.getElementById('contributorDetails').innerText = `${ethers.utils.formatEther(amount)} CORE`;
  } catch (error) {
    console.error(error);
  }
};

const getBalance = async () => {
  try {
    const balance = await contract.getBalance();
    document.getElementById('miscData').innerText = `Balance: ${ethers.utils.formatEther(balance)} CORE`;
  } catch (error) {
    console.error(error);
  }
};

const getTimeRemaining = async () => {
  try {
    const timeLeft = await contract.getTimeRemaining();
    document.getElementById('miscData').innerText += `\nTime Left: ${formatTime(timeLeft)}`;
  } catch (error) {
    console.error(error);
  }
};

const formatTime = (seconds) => {
  if (seconds <= 0) return 'Expired';
  const d = Math.floor(seconds / (3600*24));
  const h = Math.floor(seconds % (3600*24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);

  return `${d}d ${h}h ${m}m ${s}s`;
};

const shortAddress = (addr) => `${addr.slice(0,6)}...${addr.slice(-4)}`;

const autoRefresh = () => {
  setInterval(() => {
    loadLeaderboard();
    loadSummary();
  }, 30000); // every 30 seconds
};

// ========== Event Listeners ==========
document.getElementById('connectWallet').onclick = connectWallet;
document.getElementById('contributeBtn').onclick = contribute;
document.getElementById('summaryBtn').onclick = loadSummary;
document.getElementById('leaderboardBtn').onclick = loadLeaderboard;
document.getElementById('refundBtn').onclick = refund;
document.getElementById('withdrawBtn').onclick = withdrawFunds;
document.getElementById('extendBtn').onclick = extendDeadline;
document.getElementById('getContributionBtn').onclick = getContribution;
document.getElementById('getBalanceBtn').onclick = getBalance;
document.getElementById('getTimeBtn').onclick = getTimeRemaining;
