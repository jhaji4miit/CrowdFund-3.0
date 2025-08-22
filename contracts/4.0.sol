// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFund {
    address public owner;
    uint public goalAmount;
    uint public deadline;
    uint public totalRaised;
    uint public extensionCount;
    uint public maxExtensions = 2; // Prevents abuse
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
    event RefundClaimed(address indexed contributor, uint amount);
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner); // ✅ new event

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

    // 1. Multi-Beneficiary Payout
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

    // 2. Emergency Refund
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

    // 3. Partial Withdrawal before deadline
    function partialWithdrawal(uint amount) external onlyOwner notCanceled {
        require(block.timestamp < deadline, "Campaign already ended");
        require(amount > 0, "Amount must be greater than zero");
        require(address(this).balance >= amount, "Insufficient balance");
        require(amount <= (totalRaised / 2), "Cannot withdraw more than 50% of raised funds before end");
        payable(owner).transfer(amount);
        emit PartialWithdrawal(owner, amount);
    }

    // 4. Self-refund for contributors after failed campaign
    function claimRefund() external {
        require(block.timestamp > deadline, "Campaign not ended yet");
        require(!goalReached, "Goal was reached; no refund available");
        require(!campaignCanceled, "Campaign canceled, use emergency refund");
        uint amount = contributions[msg.sender];
        require(amount > 0, "No contribution to refund");
        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit RefundClaimed(msg.sender, amount);
    }

    // 5. Deadline Extension by Owner
    function extendDeadline(uint extraDays) external onlyOwner notCanceled {
        require(block.timestamp < deadline, "Campaign already ended");
        require(extraDays > 0, "Extension must be positive");
        require(extensionCount < maxExtensions, "Max extensions reached");
        deadline += extraDays * 1 days;
        extensionCount++;
    }

    // 6. View all contributors and their contributions
    function getContributors() external view returns (address[] memory, uint[] memory) {
        uint[] memory amounts = new uint[](contributors.length);
        for (uint i = 0; i < contributors.length; i++) {
            amounts[i] = contributions[contributors[i]];
        }
        return (contributors, amounts);
    }

    // 7. View contribution of a specific user
    function viewContribution(address _user) external view returns (uint) {
        return contributions[_user];
    }

    // 8. Update campaign goal
    function updateGoal(uint newGoalAmount) external onlyOwner notCanceled {
        require(block.timestamp < deadline, "Campaign already ended");
        require(!goalReached, "Goal already reached");
        require(newGoalAmount > 0, "Goal must be greater than zero");
        require(newGoalAmount >= totalRaised, "Goal must be >= funds already raised");
        goalAmount = newGoalAmount;
    }

    // 9. ✅ NEW FUNCTION: Transfer ownership
    function changeOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
