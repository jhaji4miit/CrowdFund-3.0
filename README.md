# 🧡 Crowdfund — Empowering Decentralized Dreams

Welcome to **Crowdfund**, a decentralized crowdfunding platform built on the **Core DAO blockchain**. Designed with **dynamic smart contract interaction**, **advanced animations**, and **seamless wallet integration**, this platform lets users contribute to causes transparently and securely.

---

## 🚀 Project Description

Crowdfund is a fully decentralized crowdfunding dApp that enables anyone to raise or contribute funds via smart contracts on Core DAO. From campaign overviews to a real-time leaderboard of contributors, every part of the system is built for **trustless transactions** and **engaging user experiences**.

It includes:

- 🎬 A beautiful animated **welcome screen**
- 🦊 A **MetaMask wallet connector**
- 📊 **Campaign statistics and summary**
- 💸 **Contribution interface**
- 📈 **Real-time dynamic leaderboard**
- 🛠️ An **Admin-only dashboard**
- 📱 **PWA support** for mobile/web app functionality

---

## 🌍 Project Vision

The goal of Crowdfund is to **democratize fundraising** by eliminating intermediaries and offering a **transparent, blockchain-based solution**. We envision a platform where anyone in the world can:

- 🚀 Launch **verified campaigns**
- 💖 Contribute to **impactful causes**
- 🔍 Monitor progress **in real-time**
- 🔐 Trust that every transaction is **secure and tamper-proof**

By leveraging **Core DAO**, we ensure **fast**, **low-cost**, and **eco-friendly** transactions, making crowdfunding accessible to all.

---

## 🔑 Key Features

### 🎯 Smart Contract (Solidity) – Deployed at  
**`0x9Be29Cb7E9d6Fa19E412B6980b9c82f74227ECa3`**

- ✅ **Contribute ETH** securely before the deadline
- ✅ **Automatic refund** if the goal isn't reached
- ✅ **Owner-only withdrawals** after a successful campaign
- ✅ **Deadline extensions** (admin-only, one-time)
- ✅ **Campaign summary** viewable by all
- ✅ **Track all contributors** and amounts
- ✅ **Transfer ownership** to another address
- ✅ **Reset campaign** with a new goal and deadline
- ✅ **Count contributors** on-chain
- ✅ **Check contributor status** (if someone has contributed)
- ✅ **Check campaign balance**, time remaining, etc.

### 🔐 Admin-Only Controls
- 🧾 Withdraw funds after campaign success
- ⏳ Extend campaign deadline
- 🔁 Reset campaign with new goal and duration
- 👑 Transfer contract ownership

### 🧠 Frontend & UI
- 🌟 Beautiful animated **landing screen**
- 👛 **MetaMask** integration using **Ethers.js**
- 📊 **Real-time stats** from smart contract
- 🧮 Leaderboard sorted by contribution amount
- 🔒 Admin dashboard with conditional rendering
- 📲 **PWA-enabled** (offline support via `manifest.json` & `service-worker.js`)
- 🎨 **Responsive UI** (works on desktop & mobile)
- ⚡ **Zero backend required** — frontend directly communicates with the smart contract

---

## 🔭 Future Scope

- 🎯 **Multi-Campaign Support**  
  Enable multiple campaigns with sorting/filtering by category, amount raised, etc.

- 🌐 **User Profiles**  
  Allow contributors to create profiles and track their impact history.

- 🧠 **AI-Powered Campaign Discovery**  
  Recommend campaigns based on user preferences and activity.

- 🛡 **Campaign Verification System**  
  Add KYC & decentralized reputation scoring for campaign owners.

- 📱 **Full Mobile App Deployment**  
  Wrap PWA for Android/iOS via Capacitor or similar frameworks.

---

## 🛠 Tech Stack

| Layer        | Technology                  |
|--------------|------------------------------|
| Blockchain   | Core DAO Testnet 2           |
| Smart Contract | Solidity (via Hardhat)     |
| Frontend     | HTML, CSS, JavaScript (Vanilla) |
| Wallet       | MetaMask + Ethers.js         |
| Deployment   | Netlify                      |
| PWA Support  | `manifest.json`, `service-worker.js` |

---

## ⚙️ Setup Instructions 

1. Clone this repo and `cd` into it.
2. Open `index.html` in any browser OR deploy to Netlify.
3. For contract redeployment:

```bash
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network coretestnet


## 🧠 Smart Contract

The dApp interacts with the deployed smart contract at:  
0x9Be29Cb7E9d6Fa19E412B6980b9c82f74227ECa3

<img width="1110" alt="image" src="https://github.com/user-attachments/assets/94cf4ce7-827e-4688-8ee0-1aaab75ce759" />



