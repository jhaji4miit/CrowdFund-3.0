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
    address[] private contributorIndex;   // Track unique contributors

    event ContributionReceived(address indexed contributor, uint amount);
    event GoalReached(uint totalAmountRaised);
    event RefundIssued(address indexed contributor, uint amount);
    event FundsWithdrawn(address indexed owner, uint amount);
    event DeadlineExtended(uint newDeadline);

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

    // 1️⃣ Contribute
    function contribute() public payable beforeDeadline {
        require(msg.value > 0, "Contribution must be greater than 0");

        if (contributions[msg.sender] == 0) {
            contributorIndex.push(msg.sender);          // store first‑time contributor
        }

        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        emit ContributionReceived(msg.sender, msg.value);

        if (totalRaised >= goalAmount && !goalReached) {
            goalReached = true;
            emit GoalReached(totalRaised);
        }
    }

    // 2️⃣ View contract balance
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    // 3️⃣ Withdraw by owner
    function withdrawFunds() public onlyOwner afterDeadline {
        require(goalReached, "Funding goal not met");
        require(!fundsWithdrawn, "Funds already withdrawn");

        fundsWithdrawn = true;
        uint bal = address(this).balance;
        payable(owner).transfer(bal);

        emit FundsWithdrawn(owner, bal);
    }

    // 4️⃣ Refund if goal not met
    function refund() public afterDeadline {
        require(!goalReached, "Goal was reached, no refunds");
        uint amount = contributions[msg.sender];
        require(amount > 0, "No contributions to refund");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit RefundIssued(msg.sender, amount);
    }

    // 5️⃣ Time remaining
    function getTimeRemaining() public view returns (uint) {
        return block.timestamp >= deadline ? 0 : deadline - block.timestamp;
    }

    // 6️⃣ Contributor details
    function getContributorDetails(address _contributor) public view returns (uint) {
        return contributions[_contributor];
    }

    // 7️⃣ Extend deadline (once)
    function extendDeadline(uint _extraDays) public onlyOwner {
        require(!deadlineExtended, "Deadline can only be extended once");
        require(_extraDays > 0, "Must add at least 1 day");

        deadline += _extraDays * 1 days;
        deadlineExtended = true;

        emit DeadlineExtended(deadline);
    }

    // 8️⃣ Campaign summary
    function getCampaignSummary() public view returns (
        address campaignOwner,
        uint targetAmount,
        uint totalContributions,
        uint timeRemaining,
        bool hasReachedGoal,
        bool isWithdrawn,
        bool wasExtended
    ) {
        return (
            owner,
            goalAmount,
            totalRaised,
            getTimeRemaining(),
            goalReached,
            fundsWithdrawn,
            deadlineExtended
        );
    }

    // 9️⃣ Top contributors leaderboard
    function listTopContributors(uint _count) public view returns (address[] memory topAddrs, uint[] memory topAmounts) {
        uint n = contributorIndex.length;
        if (_count > n) _count = n;

        // Build arrays for sorting (simple selection sort O(n^2) – acceptable for small n)
        address[] memory addrs = new address[](n);
        uint[] memory amounts = new uint[](n);
        for (uint i; i < n; i++) {
            addrs[i] = contributorIndex[i];
            amounts[i] = contributions[contributorIndex[i]];
        }

        // Selection sort the arrays by amount descending
        for (uint i = 0; i < _count; i++) {
            uint maxIdx = i;
            for (uint j = i + 1; j < n; j++) {
                if (amounts[j] > amounts[maxIdx]) {
                    maxIdx = j;
                }
            }
            // Swap
            (amounts[i], amounts[maxIdx]) = (amounts[maxIdx], amounts[i]);
            (addrs[i], addrs[maxIdx])     = (addrs[maxIdx], addrs[i]);
        }

        // Prepare trimmed return arrays
        topAddrs = new address[](_count);
        topAmounts = new uint[](_count);
        for (uint i; i < _count; i++) {
            topAddrs[i] = addrs[i];
            topAmounts[i] = amounts[i];
        }
    }
}
