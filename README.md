# 🧡 CrowdFund — Empowering Decentralized Dreams

Welcome to **CrowdFund**, a decentralized crowdfunding platform built on the Core DAO blockchain. It offers full transparency, trustless transactions, and an engaging, interactive experience for both campaigners and contributors.

---

## 🚀 Project Description

**CrowdFund** is a fully decentralized crowdfunding dApp where anyone can raise or contribute funds via blockchain smart contracts. With real-time statistics, contributor tracking, and powerful admin tools, the platform eliminates intermediaries and empowers communities.

---

## 🌍 Project Vision

The vision behind CrowdFund is to **democratize fundraising** by removing third parties and enabling **secure, fast, and transparent** fundraising for everyone worldwide.

### With CrowdFund, users can:
- Launch verified campaigns from anywhere
- Contribute to meaningful causes securely
- Track campaign progress live
- Trust in tamper-proof smart contracts on Core DAO

---

## 🔑 Key Features

✅ Decentralized Smart Contract Campaigns  
✅ MetaMask & Wallet Integration (Ethers.js)  
✅ Real-Time Campaign Stats & Leaderboard  
✅ Refund & Withdrawal Mechanisms  
✅ Mobile-Friendly, Animated UI  
✅ Admin-Only Controls  
✅ Resettable Campaigns  
✅ PWA Support for Web/Mobile  
✅ Built on Core DAO (Eco-friendly, Low-cost)  
✅ No centralized backend — fully on-chain  

---

## 🔭 Future Scope

🎯 **Multi-Campaign Support**  
Enable many simultaneous campaigns with search, filter, and sorting.

🌐 **User Profiles & Activity Logs**  
Allow contributors to create profiles and see contribution history.

🧠 **AI-Powered Discovery Engine**  
Recommend campaigns based on user preferences or browsing behavior.

🛡 **Campaign Reputation System**  
Implement KYC & trust scores for project owners.

📱 **Native Mobile App Support**  
Package the PWA into installable apps via Capacitor or Flutter.

📦 **Milestone-Based Funding**  
Add support for multi-phase fund releases upon milestone verifications.

---

## 🧠 Smart Contract: `CrowdFund.sol`

### 🔐 Access Control
- `onlyOwner` modifier — restricts function to the campaign owner
- `beforeDeadline` / `afterDeadline` modifiers — control timing for actions

---

👥 Contribution Logic
Function	Description
contribute()	Allows users to send ETH before deadline
getBalance()	Returns the contract’s current ETH balance
refund()	Lets contributors withdraw their funds if goal not met
getContributorDetails(address)	Returns how much a specific address contributed
getAllContributors()	Returns all contributor addresses
getAllContributionAmounts()	Returns all contributors and their contribution values

📊 Campaign Summary
Function	Description
getCampaignSummary()	Returns goal, raised amount, time left, goal status, withdrawal status
getTimeRemaining()	Returns seconds remaining until the deadline
getRemainingGoalAmount()	Returns how much ETH is needed to hit the goal
getAverageContribution()	Calculates the average contribution amount
getContributorCount()	Total number of contributors
hasContributed(address)	Returns true if the user has contributed
getContributionPercentage(address)	Returns user’s contribution as a % of total raised
getTopContributor()	Returns address and amount of the largest single contributor
isCampaignActive()	Checks if campaign is still ongoing and goal not reached

⚙️ Admin Controls
Function	Description
withdrawFunds()	Owner can withdraw ETH if campaign is successful
transferOwnership(address)	Transfer control to another address
extendDeadline(uint)	Extend the deadline by given number of days (once only)
resetCampaign(uint, uint)	Restart campaign after deadline with new goal & time
isOwner()	Returns true if msg.sender is owner

📦 Events
ContributionReceived(address, uint)

GoalReached(uint)

RefundIssued(address, uint)

FundsWithdrawn(address, uint)

DeadlineExtended(uint)

OwnershipTransferred(address, address)

CampaignReset(uint, uint)

🛠 Tech Stack
Layer	Technology
Blockchain	Core DAO Testnet
Smart Contract	Solidity
Wallet	MetaMask (via Ethers.js)
Frontend	HTML, CSS, JavaScript (Vanilla)
Deployment	Netlify
Mobile App	PWA (manifest.json, service-worker.js)

✅ Contract Deployment
Contract Address:
0x824956bbdAa68005C90a0387efeB67C23adf4C26 (Core DAO)
<img width="1106" alt="image" src="https://github.com/user-attachments/assets/0fd3c6f6-864d-46aa-9e10-0e12a646e071" />
