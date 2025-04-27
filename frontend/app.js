import abi from './abi.json' assert { type: 'json' };

// Contract Setup
const contractAddress = "0xb872722d611bE8f7F53090B9236D0Ba7Cb58e875";
let contract, signer, provider, currentAccount;

document.addEventListener('DOMContentLoaded', async function() {
  const welcomeScreen = document.getElementById('welcome-screen');
  const mainApp = document.getElementById('main-app');
  const enterAppBtn = document.getElementById('enterAppBtn');

  enterAppBtn.addEventListener('click', async function() {
    welcomeScreen.style.display = 'none';
    mainApp.style.display = 'block';
    await connectWallet();
    await loadLeaderboard();
    checkOwner();
  });

  document.getElementById('contributeBtn').addEventListener('click', contribute);
  document.getElementById('withdrawBtn').addEventListener('click', withdrawFunds);
  document.getElementById('refundBtn').addEventListener('click', refund);
  document.getElementById('extendDeadlineBtn').addEventListener('click', extendDeadline);
});

// Wallet connection
async function connectWallet() {
  provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  currentAccount = await signer.getAddress();
  contract = new ethers.Contract(contractAddress, abi, signer);
  console.log('✅ Wallet connected:', currentAccount);
}

// Contribute to campaign
async function contribute() {
  const amount = document.getElementById('contributeAmount').value;
  if (!amount) return alert('Enter an amount!');
  const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
  await tx.wait();
  alert('🎉 Contribution successful!');
  loadLeaderboard();
}

// Load leaderboard
async function loadLeaderboard() {
  const leaderboard = document.getElementById('leaderboard');
  leaderboard.innerHTML = 'Loading...';

  const contributors = await contract.getAllContributors();
  let entries = [];

  for (let addr of contributors) {
    const amount = await contract.getContributorDetails(addr);
    entries.push({ address: addr, amount: ethers.utils.formatEther(amount) });
  }

  entries.sort((a, b) => b.amount - a.amount);

  leaderboard.innerHTML = entries.map((entry, idx) => 
    `<div class="leaderboard-entry">${idx + 1}. ${shorten(entry.address)} - ${entry.amount} CORE</div>`
  ).join('');
}

function shorten(address) {
  return address.slice(0,6) + "..." + address.slice(-4);
}

// Admin Only: Withdraw
async function withdrawFunds() {
  const tx = await contract.withdrawFunds();
  await tx.wait();
  alert('✅ Funds withdrawn!');
}

// Admin Only: Refund
async function refund() {
  const tx = await contract.refund();
  await tx.wait();
  alert('✅ Refund processed!');
}

// Admin Only: Extend Deadline
async function extendDeadline() {
  const extraDays = prompt('How many extra days?');
  if (extraDays) {
    const tx = await contract.extendDeadline(extraDays);
    await tx.wait();
    alert('✅ Deadline extended!');
  }
}

// Check if current user is owner
async function checkOwner() {
  const owner = await contract.owner();
  if (currentAccount.toLowerCase() === owner.toLowerCase()) {
    document.getElementById('admin-section').style.display = 'block';
  }
}

// Install Prompt
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log(choiceResult.outcome === 'accepted' ? '✅ App Installed' : '❌ App Installation dismissed');
      deferredPrompt = null;
    });
  });
});

// Typewriter Effect for Welcome
const words = ["Decentralized.", "Transparent.", "Empowering Dreams."];
let i = 0, timer;
function typingEffect() {
  let word = words[i].split("");
  var loopTyping = function() {
    if (word.length > 0) {
      document.getElementById('typewriter').innerHTML += word.shift();
    } else {
      deletingEffect();
      return;
    };
    timer = setTimeout(loopTyping, 150);
  };
  loopTyping();
}
function deletingEffect() {
  let word = words[i].split("");
  var loopDeleting = function() {
    if (word.length > 0) {
      word.pop();
      document.getElementById('typewriter').innerHTML = word.join("");
    } else {
      i = (i + 1) % words.length;
      typingEffect();
      return;
    };
    timer = setTimeout(loopDeleting, 100);
  };
  setTimeout(loopDeleting, 1000);
}
typingEffect();
