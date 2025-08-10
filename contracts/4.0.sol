// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFund {
    address public owner;
    uint public goalAmount;
    uint public deadline;
    uint public totalRaised;
    bool public goalReached;
    bool public fundsWithdrawn;

    mapping(address => uint) public contributions;

    event ContributionReceived(address indexed contributor, uint amount);
    event GoalReached(uint totalAmountRaised);
    event SplitPayoutExecuted(address[] recipients, uint[] amounts);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    constructor(uint _goalAmount, uint _durationInDays) {
        owner = msg.sender;
        goalAmount = _goalAmount;
        deadline = block.timestamp + (_durationInDays * 1 days);
    }

    function contribute() external payable {
        require(block.timestamp < deadline, "Deadline passed");
        require(msg.value > 0, "Contribution must be > 0");
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;
        emit ContributionReceived(msg.sender, msg.value);
        if (totalRaised >= goalAmount) {
            goalReached = true;
            emit GoalReached(totalRaised);
        }
    }

    // ✅ New Advanced Function: Split Payout
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
}

