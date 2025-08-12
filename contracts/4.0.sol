// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFund {
    address public owner;
    uint public goalAmount;
    uint public deadline;
    uint public totalRaised;
    bool public goalReached;
    bool public fundsWithdrawn;
    bool public campaignCanceled;

    mapping(address => uint) public contributions;
    address[] private contributors;

    event ContributionReceived(address indexed contributor, uint amount);
    event GoalReached(uint totalAmountRaised);
    event SplitPayoutExecuted(address[] recipients, uint[] percentages);
    event EmergencyRefundExecuted(uint totalRefunded);
    event CampaignCanceled();
    event PartialWithdrawal(address indexed owner, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier notCanceled() {
        require(!campaignCanceled, "Campaign canceled");
        _;
    }

    constructor(uint _goalAmount, uint _durationInDays) {
        owner = msg.sender;
        goalAmount = _goalAmount;
        deadline = block.timestamp + (_durationInDays * 1 days);
    }

    function contribute() external payable notCanceled {
        require(block.timestamp < deadline, "Deadline passed");
        require(msg.value > 0, "Contribution must be > 0");

        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        emit ContributionReceived(msg.sender, msg.value);

        if (totalRaised >= goalAmount) {
            goalReached = true;
            emit GoalReached(totalRaised);
        }
    }

    // ✅ 1. Advanced Function: Multi-Beneficiary Payout
    function splitPayout(address[] calldata recipients, uint[] calldata percentages) external onlyOwner {
        require(goalReached, "Goal not reached yet");
        require(!fundsWithdrawn, "Funds already withdrawn");
        require(recipients.length == percentages.length, "Mismatched arrays");

        uint totalPercent;
        for (uint i = 0; i < percentages.length; i++) {
            totalPercent += percentages[i];
        }
        require(totalPercent == 100, "Percentages must total 100");

        uint balance = address(this).balance;
        for (uint i = 0; i < recipients.length; i++) {
            uint payoutAmount = (balance * percentages[i]) / 100;
            payable(recipients[i]).transfer(payoutAmount);
        }

        fundsWithdrawn = true;
        emit SplitPayoutExecuted(recipients, percentages);
    }

    // ✅ 2. Advanced Function: Emergency Refund
    function emergencyRefund() external onlyOwner {
        require(!fundsWithdrawn, "Funds already withdrawn");
        campaignCanceled = true;
        emit CampaignCanceled();

        uint totalRefunded;
        for (uint i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint amount = contributions[contributor];
            if (amount > 0) {
                contributions[contributor] = 0;
                payable(contributor).transfer(amount);
                totalRefunded += amount;
            }
        }
        emit EmergencyRefundExecuted(totalRefunded);
    }

    // ✅ 3. New Advanced Function: Partial Withdrawal
    function partialWithdrawal(uint amount) external onlyOwner notCanceled {
        require(block.timestamp < deadline, "Campaign already ended");
        require(amount > 0, "Amount must be greater than zero");
        require(address(this).balance >= amount, "Insufficient balance");
        require(amount <= (totalRaised / 2), "Cannot withdraw more than 50% of raised funds before end");

        payable(owner).transfer(amount);
        emit PartialWithdrawal(owner, amount);
    }
}
