🚀 CrowdFund Smart Contract
A fully-featured decentralized crowdfunding smart contract written in Solidity. It allows campaign creation, contributions, withdrawals, refunds, campaign reset, leaderboard access, and status tracking with rich UI integration support.

📌 Features
Owner-controlled crowdfunding campaign

Contribution tracking and top contributor insight

Goal and deadline management

Refunds if goal is not reached

Funds withdrawal by owner after success

Campaign reset and extension support

Detailed contributor analytics

Snapshot-like campaign summary and status message

🧱 Contract Details
Solidity Version: ^0.8.0

Deployed On: Any EVM-compatible network (Core DAO, Ethereum, etc.)

Dependencies: None (pure Solidity)

📜 Deployment (with Hardhat)
Install Dependencies

bash
Copy
Edit
npm install --save-dev hardhat
Compile Contract

bash
Copy
Edit
npx hardhat compile
Deploy Contract

Update the deployment parameters in deploy.js:

js
Copy
Edit
const goalAmount = hre.ethers.utils.parseEther("10"); // 10 ETH goal
const durationInDays = 7;
Then deploy:

bash
Copy
Edit
npx hardhat run scripts/deploy.js --network <networkName>
🧩 Functions Overview
📥 Contribution
solidity
Copy
Edit
function contribute() public payable
Accepts ETH from contributors

Tracks per-address contribution

Emits ContributionReceived

💰 Withdraw Funds (Owner)
solidity
Copy
Edit
function withdrawFunds() public onlyOwner
After deadline and goal met

Emits FundsWithdrawn

💸 Refund (Contributor)
solidity
Copy
Edit
function refund() public
After deadline and goal not met

Refunds contributor ETH

Emits RefundIssued

⏳ Deadline Management
solidity
Copy
Edit
function extendDeadline(uint extraDays) public onlyOwner
Extends deadline once

Emits DeadlineExtended

🔄 Campaign Reset
solidity
Copy
Edit
function resetCampaign(uint newGoal, uint newDurationInDays) public onlyOwner
Clears data, starts fresh campaign

Emits CampaignReset

🔍 Analytics
solidity
Copy
Edit
function getCampaignSummary() public view returns (...)
function getContributorDetails(address) public view returns (uint)
function getAllContributors() public view returns (address[])
function getTopContributor() public view returns (address, uint)
function getAverageContribution() public view returns (uint)
function getRemainingGoalAmount() public view returns (uint)
function getMinimumContribution() public view returns (uint)
✅ State Checkers
solidity
Copy
Edit
function hasContributed(address) public view returns (bool)
function isCampaignActive() public view returns (bool)
function hasGoalBeenReached() public view returns (bool)
function getTimeRemaining() public view returns (uint)
function isOwner() public view returns (bool)
🗣️ NEW! Status Message
solidity
Copy
Edit
function getCampaignStatusMessage() public view returns (string)
Returns:

"Campaign in progress."

"Goal reached. Awaiting withdrawal."

"Goal reached. Funds withdrawn."

"Campaign ended. Goal not reached."

🔐 Ownership
solidity
Copy
Edit
function transferOwnership(address newOwner) public onlyOwner
Transfers contract control

Emits OwnershipTransferred

📦 File Structure
lua
Copy
Edit
CrowdFund/
├── contracts/
│   └── CrowdFund.sol
├── scripts/
│   └── deploy.js
├── hardhat.config.js
├── package.json
└── README.md

📬 Contact
For integration help, DApp UI, or advanced deployment, feel free to reach out!



## ✅ Contract Deployment
Contract Address:
0x824956bbdAa68005C90a0387efeB67C23adf4C26 (Core DAO)
<img width="1106" alt="image" src="https://github.com/user-attachments/assets/0fd3c6f6-864d-46aa-9e10-0e12a646e071" />
