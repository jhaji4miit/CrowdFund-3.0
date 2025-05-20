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
}
