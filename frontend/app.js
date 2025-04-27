import abi from './abi.json' assert { type: 'json' };

const contractAddress = "0xb872722d611bE8f7F53090B9236D0Ba7Cb58e875";

let web3;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    contract = new web3.eth.Contract(abi, contractAddress);
    console.log("Connected to Smart Contract Successfully!");
  } else {
    alert("MetaMask not detected. Please install it.");
  }
}

async function contribute() {
  const amount = document.getElementById('amount').value;
  const accounts = await web3.eth.getAccounts();

  await contract.methods.contribute().send({
    from: accounts[0],
    value: web3.utils.toWei(amount, "ether")
  });

  alert('Contribution Successful!');
}

async function withdrawFunds() {
  const accounts = await web3.eth.getAccounts();

  await contract.methods.withdrawFunds().send({
    from: accounts[0]
  });

  alert('Funds Withdrawn Successfully!');
}

async function refund() {
  const accounts = await web3.eth.getAccounts();

  await contract.methods.refund().send({
    from: accounts[0]
  });

  alert('Refund Processed!');
}

async function getCampaignSummary() {
  const summary = await contract.methods.getCampaignSummary().call();
  console.log("Campaign Summary:", summary);

  document.getElementById('summary').innerHTML = `
    <b>Goal Amount:</b> ${web3.utils.fromWei(summary.goal, "ether")} ETH<br>
    <b>Total Raised:</b> ${web3.utils.fromWei(summary.raised, "ether")} ETH<br>
    <b>Time Remaining:</b> ${summary.timeLeft} seconds<br>
    <b>Goal Reached:</b> ${summary.reached}<br>
    <b>Funds Withdrawn:</b> ${summary.withdrawn}<br>
  `;
}

async function extendDeadline() {
  const extraDays = document.getElementById('extraDays').value;
  const accounts = await web3.eth.getAccounts();

  await contract.methods.extendDeadline(extraDays).send({
    from: accounts[0]
  });

  alert('Deadline Extended Successfully!');
}

async function getAllContributors() {
  const contributors = await contract.methods.getAllContributors().call();
  console.log("Contributors List:", contributors);

  document.getElementById('contributorsList').innerHTML = contributors.join('<br>');
}

async function getMyContribution() {
  const accounts = await web3.eth.getAccounts();
  const myContribution = await contract.methods.getContributorDetails(accounts[0]).call();

  alert(`You have contributed: ${web3.utils.fromWei(myContribution, "ether")} ETH`);
}

window.addEventListener('load', async () => {
  await connectWallet();
});
