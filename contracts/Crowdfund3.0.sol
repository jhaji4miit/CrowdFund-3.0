// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFund {
    address public owner;
    uint public goalAmount;
    uint public deadline;
    uint public totalRaised;
    bool public goalReached;
    bool public fundsWithdrawn;
    bool public deadlineExtended;

    mapping(address => uint) public contributions;
    address[] private contributorIndex;

    event ContributionReceived(address indexed contributor, uint amount);
    event GoalReached(uint totalAmountRaised);
    event RefundIssued(address indexed contributor, uint amount);
    event FundsWithdrawn(address indexed owner, uint amount);
    event DeadlineExtended(uint newDeadline);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event CampaignReset(uint newGoal, uint newDeadline);

    constructor(uint _goalAmount, uint _durationInDays) {
        owner = msg.sender;
        goalAmount = _goalAmount;
        deadline = block.timestamp + (_durationInDays * 1 days);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Deadline passed");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp >= deadline, "Deadline not reached");
        _;
    }

    function contribute() public payable beforeDeadline {
        require(msg.value > 0, "No ETH sent");

        if (contributions[msg.sender] == 0) {
            contributorIndex.push(msg.sender);
        }

        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        emit ContributionReceived(msg.sender, msg.value);

        if (totalRaised >= goalAmount && !goalReached) {
            goalReached = true;
            emit GoalReached(totalRaised);
        }
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function withdrawFunds() public onlyOwner afterDeadline {
        require(goalReached && !fundsWithdrawn, "Cannot withdraw");
        fundsWithdrawn = true;
        payable(owner).transfer(address(this).balance);
        emit FundsWithdrawn(owner, address(this).balance);
    }

    function refund() public afterDeadline {
        require(!goalReached, "Goal reached");
        uint amount = contributions[msg.sender];
        require(amount > 0, "No contributions");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit RefundIssued(msg.sender, amount);
    }

    function extendDeadline(uint _extraDays) public onlyOwner beforeDeadline {
        require(!deadlineExtended, "Already extended");
        deadline += _extraDays * 1 days;
        deadlineExtended = true;
        emit DeadlineExtended(deadline);
    }

    function getTimeRemaining() public view returns (uint) {
        return block.timestamp >= deadline ? 0 : deadline - block.timestamp;
    }

    function getContributorDetails(address user) public view returns (uint) {
        return contributions[user];
    }

    function getAllContributors() public view returns (address[] memory) {
        return contributorIndex;
    }

    function getAllContributionAmounts() public view returns (address[] memory, uint[] memory) {
        uint len = contributorIndex.length;
        uint[] memory amounts = new uint[](len);
        for (uint i = 0; i < len; i++) {
            amounts[i] = contributions[contributorIndex[i]];
        }
        return (contributorIndex, amounts);
    }

    function getCampaignSummary() public view returns (
        uint goal,
        uint raised,
        uint timeLeft,
        bool reached,
        bool withdrawn
    ) {
        return (
            goalAmount,
            totalRaised,
            getTimeRemaining(),
            goalReached,
            fundsWithdrawn
        );
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function resetCampaign(uint _newGoalAmount, uint _newDurationInDays) public onlyOwner {
        require(block.timestamp >= deadline, "Current campaign active");

        goalAmount = _newGoalAmount;
        deadline = block.timestamp + (_newDurationInDays * 1 days);
        totalRaised = 0;
        goalReached = false;
        fundsWithdrawn = false;
        deadlineExtended = false;

        for (uint i = 0; i < contributorIndex.length; i++) {
            contributions[contributorIndex[i]] = 0;
        }

        delete contributorIndex;

        emit CampaignReset(goalAmount, deadline);
    }

    function getTotalContributionFromAddress(address user) public view returns (uint) {
        return contributions[user];
    }

    function getContributorCount() public view returns (uint) {
        return contributorIndex.length;
    }

    function hasContributed(address user) public view returns (bool) {
        return contributions[user] > 0;
    }

    function getLatestContributor() public view returns (address) {
        if (contributorIndex.length == 0) return address(0);
        return contributorIndex[contributorIndex.length - 1];
    }
}

