# 🎯 CrowdFund Smart Contract

A robust, secure, and transparent crowdfunding smart contract built on Solidity. It enables anyone to launch and manage decentralized fundraising campaigns on the blockchain. Supports contributor tracking, refunds, deadline extensions, and detailed campaign analytics.

---

## ✅ Project Vision

The **CrowdFund** contract aims to democratize fundraising by leveraging blockchain technology. By eliminating intermediaries and enforcing transparency through smart contracts, it empowers campaign creators and donors alike with full visibility, control, and trustless execution.

---

## 🔑 Key Features

- 📌 **Goal-Based Funding:** Set campaign funding targets and deadlines.
- 👥 **Contributor Tracking:** Records contributions per address and tracks all contributors.
- 🔐 **Owner Privileges:** Secure withdrawal, deadline extension, and ownership transfer.
- ⏳ **Deadline Mechanism:** Prevents funding after time expiration.
- 🔁 **Refund Support:** Allows contributors to reclaim funds if the campaign fails.
- 📊 **Advanced Insights:** Includes top contributor, average, and minimum contributions.
- ⚡ **Analytics & Transparency:** Offers comprehensive data for dApp integration.
- 🔄 **Campaign Reset:** Restart a new campaign once the previous one ends.
- 🌍 **Public Access:** Most functions are public/view to support external frontend integration.

---

## 🔮 Future Scope

- 🗳️ **DAO Voting for Campaigns**
- 🌐 **Multi-Campaign Support**
- 🪙 **Token-Based Contributions**
- 📱 **Mobile App + PWA**
- 🤖 **AI Prediction for Campaign Success**
- 🧾 **Contribution Receipts + NFT Badges**
- 🔗 **Cross-chain Compatibility (via LayerZero or Axelar)**

---

## 🔍 Function Breakdown

| Function | Type | Description |
|---------|------|-------------|
| `constructor(uint goalAmount, uint durationInDays)` | constructor | Initializes the contract with a goal and deadline. |
| `contribute()` | payable | Allows users to send ETH as a contribution. |
| `getBalance()` | view | Returns current balance of contract. |
| `withdrawFunds()` | onlyOwner | Allows the owner to withdraw funds after success. |
| `refund()` | public | Contributors can claim their ETH if goal fails. |
| `extendDeadline(uint extraDays)` | onlyOwner | Can only be called once to extend the campaign. |
| `getTimeRemaining()` | view | Returns seconds until the deadline. |
| `getContributorDetails(address user)` | view | Returns amount contributed by specific address. |
| `getAllContributors()` | view | Returns an array of contributor addresses. |
| `getAllContributionAmounts()` | view | Returns all contributors and their amounts. |
| `getCampaignSummary()` | view | Returns goal, raised, time left, goal status, and withdrawal status. |
| `transferOwnership(address newOwner)` | onlyOwner | Changes contract ownership. |
| `resetCampaign(uint newGoalAmount, uint newDurationInDays)` | onlyOwner | Resets the campaign after the current ends. |
| `getContributorCount()` | view | Returns total number of contributors. |
| `hasContributed(address user)` | view | Checks if user has contributed. |
| `getTopContributor()` | view | Returns address and amount of top contributor. |
| `getAverageContribution()` | view | Returns average contribution amount. |
| `isCampaignActive()` | view | Checks if campaign is still active. |
| `getContributionPercentage(address user)` | view | Returns % of total raised by a user. |
| `isOwner()` | view | Returns true if caller is contract owner. |
| `getRemainingGoalAmount()` | view | Amount left to reach the goal. |
| `getMinimumContribution()` | view | Returns the smallest contribution made. |
| `hasGoalBeenReached()` | view | ✅ NEW: Returns true if the funding goal was achieved. |

---

## 📂 File Structure

```bash
CrowdFund/
├── contracts/
│   └── CrowdFund.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── CrowdFund.test.js
├── hardhat.config.js
├── README.md
└── package.json
📜 License
MIT © 2025

🙌 Built with ❤️ using React, Solidity & Hardhat

## ✅ Contract Deployment
Contract Address:
0x824956bbdAa68005C90a0387efeB67C23adf4C26 (Core DAO)
<img width="1106" alt="image" src="https://github.com/user-attachments/assets/0fd3c6f6-864d-46aa-9e10-0e12a646e071" />
