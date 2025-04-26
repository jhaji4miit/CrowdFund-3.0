// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFund {
    address public owner;
    uint public goalAmount;
    uint public deadline;
    uint public totalRaised;
    bool public goalReached;
    bool public fundsWithdrawn;
    bool public deadlineExtended; // ✅ Added: to prevent multiple extensions

    mapping(address => uint) public contributions;
    address[] private contributorIndex; // ✅ Track unique contributors

    event ContributionReceived(address indexed contributor, uint amount);
    event GoalReached(uint totalAmountRaised);
    event RefundIssued(address indexed contributor, uint amount);
    event FundsWithdrawn(address indexed owner, uint amount);
    event DeadlineExtended(uint newDeadline); // ✅ New event

    constructor(uint _goalAmount, uint _durationInDays) {
        owner = msg.sender;
        goalAmount = _goalAmount;
        deadline = block.timestamp + (_durationInDays * 1 days);
        goalReached = false;
        fundsWithdrawn = false;
        deadlineExtended = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Deadline has passed");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp >= deadline, "Deadline not reached yet");
        _;
    }

    // Function 1: Contribute to the campaign
    function contribute() public payable beforeDeadline {
        require(msg.value > 0, "Contribution must be greater than 0");

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

    // Function 2: Check balance of the contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    // Function 3: Withdraw funds by owner if goal is met
    function withdrawFunds() public onlyOwner afterDeadline {
        require(goalReached, "Funding goal not met");
        require(!fundsWithdrawn, "Funds already withdrawn");

        fundsWithdrawn = true;
        payable(owner).transfer(address(this).balance);

        emit FundsWithdrawn(owner, address(this).balance);
    }

    // Function 4: Refund contributors if goal is not met
    function refund() public afterDeadline {
        require(!goalReached, "Goal was reached, no refunds");
        uint amount = contributions[msg.sender];
        require(amount > 0, "No contributions to refund");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit RefundIssued(msg.sender, amount);
    }

    // Function 5: Get remaining time
    function getTimeRemaining() public view returns (uint) {
        if (block.timestamp >= deadline) {
            return 0;
        } else {
            return deadline - block.timestamp;
        }
    }

    // Function 6: Get contributor details
    function getContributorDetails(address _contributor) public view returns (uint) {
        return contributions[_contributor];
    }

    // Function 7: Get all unique contributor addresses
    function getAllContributors() public view returns (address[] memory) {
        return contributorIndex;
    }

    // ✅ Function 8: Extend deadline (only once)
    function extendDeadline(uint _extraDays) public onlyOwner beforeDeadline {
        require(!deadlineExtended, "Deadline already extended");
        require(_extraDays > 0, "Extension must be greater than 0");

        deadline += _extraDays * 1 days;
        deadlineExtended = true;

        emit DeadlineExtended(deadline);
    }

    // ✅ Function 9: Get campaign summary
    function getCampaignSummary() public view returns (
        uint goal,
        uint raised,
        uint timeLeft,
        bool reached,
        bool withdrawn
    ) {
        goal = goalAmount;
        raised = totalRaised;
        timeLeft = getTimeRemaining();
        reached = goalReached;
        withdrawn = fundsWithdrawn;
    }
}
