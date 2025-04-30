const contractAddress = "0x55aC56EC0102438c97c5789a5fFDea314342c0e8";
let provider;
let signer;
let contract;

const abi = [
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
    }
];

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);

        // Hide welcome screen and show main content
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';

        loadCampaigns();
    } else {
        alert("Please install MetaMask!");
    }
}

async function loadCampaigns() {
    const balance = await contract.getBalance();
    const contributors = await contract.getAllContributors();
    let campaignsHTML = `<p>Current Balance: ${ethers.utils.formatEther(balance)} ETH</p>`;
    
    campaignsHTML += `<h2>Contributors Leaderboard:</h2><ul>`;
    contributors.forEach((contributor, index) => {
        campaignsHTML += `<li>${index + 1}. Address: ${contributor}</li>`;
    });
    campaignsHTML += `</ul>`;
    
    document.getElementById('campaigns').innerHTML = campaignsHTML;
}
