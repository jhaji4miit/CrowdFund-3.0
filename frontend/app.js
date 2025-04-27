import abi from "./abi.json" assert { type: "json" };

const CONTRACT_ADDRESS = "0xb872722d611bE8f7F53090B9236D0Ba7Cb58e875"; // CoreDAO address

let provider, signer, contract, userAddress;
const connectWalletBtn = document.getElementById('connectWallet');
const contributeBtn = document.getElementById('contributeBtn');
const withdrawFundsBtn = document.getElementById('withdrawFunds');
const refundBtn = document.getElementById('refund');
const extendDeadlineBtn = document.getElementById('extendDeadline');
const leaderboardList = document.getElementById('leaderboardList');
const fundingInfo = document.getElementById('fundingInfo');
const progressFill = document.getElementById('progressFill');
const loadingSpinner = document.getElementById('loadingSpinner');
const adminPanel = document.getElementById('adminPanel');

async function connectWallet() {
    try {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
            userAddress = await signer.getAddress();

            connectWalletBtn.innerText = "Connected: " + userAddress.substring(0, 6) + "...";
            Swal.fire('Connected!', 'Wallet connected successfully.', 'success');
            checkIfOwner();
            loadCampaign();
        } else {
            Swal.fire('Error', 'MetaMask not detected!', 'error');
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
    }
}

async function checkIfOwner() {
    const owner = await contract.owner();
    if (owner.toLowerCase() === userAddress.toLowerCase()) {
        adminPanel.style.display = "block";
    }
}

async function contribute() {
    try {
        const amount = document.getElementById('contributeAmount').value;
        if (!amount || amount <= 0) {
            Swal.fire('Error', 'Enter valid amount.', 'warning');
            return;
        }
        showLoading(true);
        const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        Swal.fire('Success!', 'Contribution successful!', 'success');
        document.getElementById('contributeAmount').value = "";
        loadCampaign();
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function withdrawFunds() {
    try {
        showLoading(true);
        const tx = await contract.withdrawFunds();
        await tx.wait();
        Swal.fire('Success!', 'Funds withdrawn!', 'success');
        loadCampaign();
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function refund() {
    try {
        showLoading(true);
        const tx = await contract.refund();
        await tx.wait();
        Swal.fire('Refunded!', 'Your refund is complete.', 'success');
        loadCampaign();
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function extendDeadline() {
    try {
        const days = document.getElementById('extendDays').value;
        if (!days || days <= 0) {
            Swal.fire('Error', 'Enter valid extension days.', 'warning');
            return;
        }
        showLoading(true);
        const tx = await contract.extendDeadline(days);
        await tx.wait();
        Swal.fire('Extended!', 'Deadline extended.', 'success');
        document.getElementById('extendDays').value = "";
        loadCampaign();
    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function loadCampaign() {
    try {
        const [goal, raised, timeLeft, reached, withdrawn] = await contract.getCampaignSummary();
        const contributors = await contract.getAllContributors();

        const goalEth = ethers.utils.formatEther(goal);
        const raisedEth = ethers.utils.formatEther(raised);
        const progressPercent = Math.min((raised / goal) * 100, 100);

        fundingInfo.innerHTML = `
            Goal: ${goalEth} CORE<br>
            Raised: ${raisedEth} CORE<br>
            Time Remaining: ${formatTime(timeLeft)}
        `;
        progressFill.style.width = `${progressPercent}%`;

        leaderboardList.innerHTML = "";
        for (const address of contributors) {
            const amount = await contract.getContributorDetails(address);
            const amountEth = ethers.utils.formatEther(amount);
            const item = document.createElement('li');
            item.textContent = `${address.substring(0, 6)}...: ${amountEth} CORE`;
            leaderboardList.appendChild(item);
        }
    } catch (error) {
        console.error(error);
    }
}

function formatTime(seconds) {
    if (seconds == 0) return "Expired";
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    return `${d}d ${h}h ${m}m`;
}

function showLoading(show) {
    loadingSpinner.style.display = show ? "flex" : "none";
}

// Event Listeners
connectWalletBtn.addEventListener('click', connectWallet);
contributeBtn.addEventListener('click', contribute);
withdrawFundsBtn.addEventListener('click', withdrawFunds);
refundBtn.addEventListener('click', refund);
extendDeadlineBtn.addEventListener('click', extendDeadline);

// Auto Load Leaderboard every 30 seconds
setInterval(() => {
    if (contract) loadCampaign();
}, 30000);

window.addEventListener('load', () => {
    if (window.ethereum) connectWallet();
});
