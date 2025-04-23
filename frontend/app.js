const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
const abi = YOUR_ABI_HERE; // paste the full ABI from the contract

let web3;
let contract;
let accounts;

window.addEventListener('load', async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(abi, contractAddress);
    updateSummary();
  } else {
    alert('Please install MetaMask!');
  }
});

async function updateSummary() {
  const summary = await contract.methods.getCampaignSummary().call();
  document.getElementById('summary').innerHTML = `
    <p><strong>Owner:</strong> ${summary[0]}</p>
    <p><strong>Goal:</strong> ${web3.utils.fromWei(summary[1])} ETH</p>
    <p><strong>Total Raised:</strong> ${web3.utils.fromWei(summary[2])} ETH</p>
    <p><strong>Time Left:</strong> ${summary[3]} seconds</p>
    <p><strong>Goal Reached:</strong> ${summary[4]}</p>
    <p><strong>Funds Withdrawn:</strong> ${summary[5]}</p>
    <p><strong>Deadline Extended:</strong> ${summary[6]}</p>
  `;
}

async function contribute() {
  const amount = document.getElementById('amount').value;
  await contract.methods.contribute().send({
    from: accounts[0],
    value: web3.utils.toWei(amount, 'ether')
  });
  updateSummary();
}

async function withdraw() {
  await contract.methods.withdrawFunds().send({ from: accounts[0] });
  updateSummary();
}

async function refund() {
  await contract.methods.refund().send({ from: accounts[0] });
  updateSummary();
}

async function extendDeadline() {
  const extraDays = document.getElementById('extraDays').value;
  await contract.methods.extendDeadline(extraDays).send({ from: accounts[0] });
  updateSummary();
}
