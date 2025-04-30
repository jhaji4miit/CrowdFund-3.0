const contractAddress = "0x55aC56EC0102438c97c5789a5fFDea314342c0e8";
const contractABI = [
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCampaignSummary",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllContributors",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_contributor",
                "type": "address"
            }
        ],
        "name": "getContributorDetails",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "contribute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "refund",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_extraDays",
                "type": "uint256"
            }
        ],
        "name": "extendDeadline",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;
let currentAccount;

document.addEventListener("DOMContentLoaded", function () {
    initializeApp();
});

async function initializeApp() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access
            await window.ethereum.request({ method: "eth_requestAccounts" });
            currentAccount = web3.eth.accounts[0];
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Connected to MetaMask with account:", currentAccount);
            initEvents();
            loadWelcomeScreen();
        } catch (error) {
            console.error("User denied account access or error occurred:", error);
        }
    } else {
        alert("Please install MetaMask to use this dApp.");
    }
}

async function loadWelcomeScreen() {
    const welcomeScreen = document.getElementById("welcome-screen");
    const mainApp = document.getElementById("main-app");

    // Add click event to transition to the main app
    document.getElementById("enter-app").addEventListener("click", function () {
        welcomeScreen.classList.add("hidden");
        mainApp.classList.remove("hidden");
    });

    // Display the welcome screen
    welcomeScreen.classList.remove("hidden");
}

async function initEvents() {
    // Handle contribution
    document.getElementById("contribute-btn").addEventListener("click", async function () {
        const contributionAmount = document.getElementById("contribution-amount").value;
        if (contributionAmount > 0) {
            try {
                await contract.methods.contribute().send({ from: currentAccount, value: web3.utils.toWei(contributionAmount, "ether") });
                alert("Contribution Successful!");
                loadLeaderboard();
            } catch (err) {
                console.error("Contribution failed:", err);
            }
        } else {
            alert("Please enter a valid contribution amount.");
        }
    });

    // Handle withdrawal of funds by owner
    document.getElementById("withdraw-funds-btn").addEventListener("click", async function () {
        try {
            await contract.methods.withdrawFunds().send({ from: currentAccount });
            alert("Funds withdrawn successfully!");
        } catch (err) {
            console.error("Withdrawal failed:", err);
        }
    });

    // Handle refund for contributors
    document.getElementById("refund-btn").addEventListener("click", async function () {
        try {
            await contract.methods.refund().send({ from: currentAccount });
            alert("Refund successful!");
        } catch (err) {
            console.error("Refund failed:", err);
        }
    });

    // Handle deadline extension (admin only)
    document.getElementById("extend-deadline-btn").addEventListener("click", async function () {
        const extraDays = document.getElementById("extra-days").value;
        if (extraDays > 0) {
            try {
                await contract.methods.extendDeadline(extraDays).send({ from: currentAccount });
                alert("Deadline extended successfully!");
            } catch (err) {
                console.error("Failed to extend deadline:", err);
            }
        } else {
            alert("Please enter a valid number of days.");
        }
    });

    // Load leaderboard
    loadLeaderboard();
}

async function loadLeaderboard() {
    const leaderboardContainer = document.getElementById("leaderboard");

    try {
        const contributors = await contract.methods.getAllContributors().call();
        const contributorList = contributors.map(async (address) => {
            const contribution = await contract.methods.getContributorDetails(address).call();
            return { address, contribution: web3.utils.fromWei(contribution, "ether") };
        });

        Promise.all(contributorList).then((contributorData) => {
            const listItems = contributorData
                .map(({ address, contribution }) => `<li>Address: ${address}, Contribution: ${contribution} ETH</li>`)
                .join("");
            leaderboardContainer.innerHTML = `<ul>${listItems}</ul>`;
        });
    } catch (err) {
        console.error("Failed to load leaderboard:", err);
    }
}

async function loadCampaignSummary() {
    try {
        const summary = await contract.methods.getCampaignSummary().call();
        document.getElementById("goal-amount").innerText = `${web3.utils.fromWei(summary[0], "ether")} ETH`;
        document.getElementById("total-raised").innerText = `${web3.utils.fromWei(summary[1], "ether")} ETH`;
        document.getElementById("time-left").innerText = `${summary[2]} seconds`;
        document.getElementById("goal-reached").innerText = summary[3] ? "Yes" : "No";
        document.getElementById("funds-withdrawn").innerText = summary[4] ? "Yes" : "No";
    } catch (err) {
        console.error("Failed to load campaign summary:", err);
    }
}

// Check if the user is the owner (admin) for specific controls
async function checkAdmin() {
    const adminPanel = document.getElementById("admin-panel");
    const adminAddress = await contract.methods.owner().call();
    if (currentAccount.toLowerCase() === adminAddress.toLowerCase()) {
        adminPanel.style.display = "block";
    } else {
        adminPanel.style.display = "none";
    }
}
