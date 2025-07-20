// app.js  – CrowdFund dApp frontend logic
//--------------------------------------------------
// 1) Contract data
//--------------------------------------------------
const contractAddress = "0x824956bbdAa68005C90a0387efeB67C23adf4C26";
const contractABI = [
  // -------- Core payable / state-changing --------
  { "inputs": [],                       "name": "contribute",             "outputs": [], "stateMutability": "payable",   "type": "function" },
  { "inputs": [],                       "name": "refund",                 "outputs": [], "stateMutability": "nonpayable","type": "function" },
  { "inputs": [],                       "name": "withdrawFunds",          "outputs": [], "stateMutability": "nonpayable","type": "function" },
  { "inputs": [ { "internalType":"uint256","name":"daysToExtend","type":"uint256"}],
                                       "name": "extendDeadline",          "outputs": [], "stateMutability": "nonpayable","type": "function" },
  { "inputs": [ { "internalType":"address","name":"newOwner","type":"address"}],
                                       "name": "transferOwnership",       "outputs": [], "stateMutability": "nonpayable","type": "function" },
  { "inputs": [ { "internalType":"uint256","name":"newGoal","type":"uint256"},
                 { "internalType":"uint256","name":"newDuration","type":"uint256"}],
                                       "name": "resetCampaign",           "outputs": [], "stateMutability": "nonpayable","type": "function" },

  // -------- Read-only getters --------
  { "inputs": [], "name": "getCampaignSummary",     "outputs": [
      { "internalType":"uint256","name":"goal","type":"uint256"},
      { "internalType":"uint256","name":"raised","type":"uint256"},
      { "internalType":"uint256","name":"timeLeft","type":"uint256"},
      { "internalType":"bool",   "name":"reached","type":"bool"},
      { "internalType":"bool",   "name":"withdrawn","type":"bool"} ],
    "stateMutability":"view","type":"function" },

  { "inputs": [], "name": "isCampaignActive",         "outputs":[{ "internalType":"bool","name":"active","type":"bool"}], "stateMutability":"view","type":"function"},
  { "inputs": [ { "internalType":"address","name":"contributor","type":"address"}],
                 "name":"getContributorDetails","outputs":[{ "internalType":"uint256","name":"contribution","type":"uint256"}],
    "stateMutability":"view","type":"function"},
  { "inputs": [], "name": "getTopContributor",        "outputs":[
      { "internalType":"address","name":"topContributor","type":"address"},
      { "internalType":"uint256","name":"contribution","type":"uint256"}],
    "stateMutability":"view","type":"function"},
  { "inputs": [], "name": "getAverageContribution",   "outputs":[{ "internalType":"uint256","name":"average","type":"uint256"}], "stateMutability":"view","type":"function"},
  { "inputs": [ { "internalType":"address","name":"contributor","type":"address"}],
                 "name":"getContributionPercentage",  "outputs":[{ "internalType":"uint256","name":"percentage","type":"uint256"}],
    "stateMutability":"view","type":"function"},
  { "inputs": [], "name": "getContributorCount",       "outputs":[{ "internalType":"uint256","name":"count","type":"uint256"}],   "stateMutability":"view","type":"function"},
  { "inputs": [], "name": "getAllContributors",        "outputs":[{ "internalType":"address[]","name":"contributors","type":"address[]"}], "stateMutability":"view","type":"function"},
  { "inputs": [], "name": "getAllContributionAmounts", "outputs":[
      { "internalType":"address[]","name":"contributors","type":"address[]"},
      { "internalType":"uint256[]","name":"amounts","type":"uint256[]"}],
    "stateMutability":"view","type":"function"},
  { "inputs": [], "name": "getRemainingGoalAmount",    "outputs":[{ "internalType":"uint256","name":"remaining","type":"uint256"}], "stateMutability":"view","type":"function"},
  { "inputs": [], "name": "getMinimumContribution",    "outputs":[{ "internalType":"uint256","name":"min","type":"uint256"}],       "stateMutability":"view","type":"function"},
  { "inputs": [], "name": "hasGoalBeenReached",        "outputs":[{ "internalType":"bool","name":"","type":"bool"}],               "stateMutability":"view","type":"function"},
  { "inputs": [], "name": "owner",                     "outputs":[{ "internalType":"address","name":"","type":"address"}],         "stateMutability":"view","type":"function"}
];

//--------------------------------------------------
// 2) Global vars
//--------------------------------------------------
let provider, signer, contract;

//--------------------------------------------------
// 3) Boot helpers
//--------------------------------------------------
function initApp() {
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("main").classList.remove("hidden");
}

//--------------------------------------------------
// 4) Wallet / Contract connection
//--------------------------------------------------
async function connectWallet() {
  if (!window.ethereum) return alert("Please install MetaMask.");

  await ethereum.request({ method: "eth_requestAccounts" });
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer   = provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);

  document.getElementById("wallet-info").innerText = `Wallet: ${await signer.getAddress()}`;
  await refreshAll();
}

//--------------------------------------------------
// 5) UI refresh
//--------------------------------------------------
async function refreshAll() {
  const [goal, raised, left, reached, withdrawn] = await contract.getCampaignSummary();
  const active  = await contract.isCampaignActive();
  const [topAddr, topAmt] = await contract.getTopContributor();
  const avg     = await contract.getAverageContribution();
  const count   = await contract.getContributorCount();
  const remain  = await contract.getRemainingGoalAmount();

  // current user
  const user = signer ? await signer.getAddress() : ethers.constants.AddressZero;
  const myAmt = await contract.getContributorDetails(user);
  const percent = await contract.getContributionPercentage(user);

  // hydrate DOM
  set("goal",          fmt(goal));
  set("raised",        fmt(raised));
  set("timeLeft",      left.toString());
  set("activeStatus",  active ? "Yes" : "No");
  set("withdrawn",     withdrawn ? "Yes" : "No");
  set("yourContribution", fmt(myAmt));
  set("topContributor",  `${topAddr} (${fmt(topAmt)} ETH)`);
  set("average",       fmt(avg));
  set("percent",       percent.toString());
  set("contributorCount", count.toString());
  set("remainingGoal", fmt(remain));

  // progress bar
  const pct = goal.eq(0) ? 0 : raised.mul(100).div(goal).toNumber();
  document.getElementById("progressBar").style.width = pct + "%";
}

// helpers
function set(id,val){ document.getElementById(id).innerText = val; }
function fmt(big){ return ethers.utils.formatEther(big); }

//--------------------------------------------------
// 6) Contract action wrappers
//--------------------------------------------------
async function contribute(){
  const eth = document.getElementById("amount").value;
  if (!eth) return alert("Enter amount");
  const tx = await contract.contribute({ value: ethers.utils.parseEther(eth) });
  await tx.wait(); refreshAll();
}

async function refund(){  await (await contract.refund()).wait();  refreshAll(); }
async function withdraw(){ await (await contract.withdrawFunds()).wait(); refreshAll(); }
async function extendDeadline(){
  const d = document.getElementById("extraDays").value || "0";
  await (await contract.extendDeadline(d)).wait(); refreshAll();
}
async function transferOwnership(){
  const addr = document.getElementById("newOwner").value;
  if (!addr) return alert("Enter address");
  await (await contract.transferOwnership(addr)).wait();
  alert("Ownership transferred"); refreshAll();
}
async function resetCampaign(){
  const g = document.getElementById("newGoal").value;
  const t = document.getElementById("newDuration").value;
  if(!g||!t) return alert("Enter new goal & duration");
  await (await contract.resetCampaign(ethers.utils.parseEther(g), t)).wait();
  refreshAll();
}
async function getAllContributors(){
  const list = await contract.getAllContributors();
  alert("Contributors:\n" + list.join("\n"));
}
async function getContributionData(){
  const [addr, amt] = await contract.getAllContributionAmounts();
  let out = "Address -> ETH\n";
  addr.forEach((a,i)=> out+=`${a}: ${fmt(amt[i])}\n`);
  alert(out);
}
async function getRemaining(){ 
  const r = await contract.getRemainingGoalAmount();
  alert(`Remaining to goal: ${fmt(r)} ETH`);
}

//--------------------------------------------------
// Auto-refresh on account/network change
//--------------------------------------------------
if (window.ethereum){
  ethereum.on('accountsChanged',()=>location.reload());
  ethereum.on('chainChanged',  ()=>location.reload());
}

