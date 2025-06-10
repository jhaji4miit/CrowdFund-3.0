# 🏗️ CrowdFund Smart Contract

An advanced decentralized crowdfunding smart contract built with Solidity. It allows users to contribute ETH toward a funding goal, tracks all contributors, and includes rich features like deadline extension, refunds, campaign resets, contributor stats, and more.

## 🚀 Features

- Accepts ETH contributions with goal tracking.
- Automatically detects goal completion.
- Owner can withdraw funds if goal is met.
- Contributors can get refunds if the goal isn’t reached.
- Owner can extend campaign deadline (once).
- Tracks each contributor and their amount.
- Campaign can be reset for a new round.
- Contributor stats: top, average, count, minimum.
- Percentage share of each contributor.
- Public campaign status messages.
- Ownership transfer support.

## 🧠 Tech Stack

- **Solidity (v0.8.x)**
- **Hardhat**
- **ETH** (for contributions)
- **Events** for all key actions

## 📚 Function Reference
🟢 Public Functions (User & Owner)

| Function                             | Description                                                       |
| ------------------------------------ | ----------------------------------------------------------------- |
| `contribute()`                       | Send ETH to the campaign before the deadline.                     |
| `refund()`                           | Get refund if the campaign failed and deadline passed.            |
| `getBalance()`                       | View current ETH balance in the contract.                         |
| `getTimeRemaining()`                 | Returns seconds remaining until the deadline.                     |
| `getContributorDetails(address)`     | Returns the contribution amount of a specific user.               |
| `getAllContributors()`               | Returns a list of all contributor addresses.                      |
| `getAllContributionAmounts()`        | Returns a list of all contributors and their contributions.       |
| `getCampaignSummary()`               | Returns goal, raised, time left, goalReached, and fundsWithdrawn. |
| `getContributorCount()`              | Returns number of unique contributors.                            |
| `hasContributed(address)`            | Checks if a given address has contributed.                        |
| `getTopContributor()`                | Returns the address and amount of the top contributor.            |
| `getAverageContribution()`           | Calculates the average contribution per contributor.              |
| `isCampaignActive()`                 | Returns true if campaign is ongoing and goal not yet reached.     |
| `getContributionPercentage(address)` | Returns a user's contribution % of the total raised.              |
| `getRemainingGoalAmount()`           | Returns how much ETH is still needed to reach the goal.           |
| `getMinimumContribution()`           | Returns the smallest contribution made.                           |
| `hasGoalBeenReached()`               | Returns `true` if the goal was met.                               |
| `getCampaignStatusMessage()`         | Returns a human-readable string about campaign status.            |
| `isOwner()`                          | Returns `true` if caller is contract owner.                       |

## 🛠️ Owner-Only Functions

| Function                                    | Description                                               |
| ------------------------------------------- | --------------------------------------------------------- |
| `withdrawFunds()`                           | Withdraws raised funds after deadline if goal is reached. |
| `extendDeadline(uint extraDays)`            | Extends deadline by `extraDays` (only once).              |
| `transferOwnership(address newOwner)`       | Transfers contract ownership to a new address.            |
| `resetCampaign(uint newGoal, uint newDays)` | Resets the campaign with new goal and duration.           |

## 🧪 Events

| Event                                    | Emitted When                              |
| ---------------------------------------- | ----------------------------------------- |
| `ContributionReceived(address, uint)`    | A user sends ETH to the contract.         |
| `GoalReached(uint)`                      | Goal was reached for the first time.      |
| `RefundIssued(address, uint)`            | A contributor is refunded.                |
| `FundsWithdrawn(address, uint)`          | Owner withdraws ETH.                      |
| `DeadlineExtended(uint)`                 | Deadline is extended.                     |
| `OwnershipTransferred(address, address)` | Ownership changes.                        |
| `CampaignReset(uint, uint)`              | New campaign is started with reset state. |

## 🛡️ Security Considerations

- Reentrancy safe: funds are set to zero before transfer.
- OnlyOwner modifiers restrict critical functions.
- Checks and conditions guard deadlines, contribution state, and withdrawals.
- No external dependencies (e.g., OpenZeppelin) for lightweight deployment.


## 📈 Future Enhancements

- Multi-campaign support
- NFT-based contribution rewards
- Off-chain metadata using IPFS
- Integration with frontend DApp UI (React/Vanilla)
- Leaderboards & badges for contributors


## ✅ Contract Deployment
Contract Address:
0x824956bbdAa68005C90a0387efeB67C23adf4C26 (Core DAO)
<img width="1106" alt="image" src="https://github.com/user-attachments/assets/0fd3c6f6-864d-46aa-9e10-0e12a646e071" />
