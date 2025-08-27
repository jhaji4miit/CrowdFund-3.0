// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFund {
    address public owner;
    uint public goalAmount;
    uint public deadline;
    uint public totalRaised;
    uint public extensionCount;
    uint public maxExtensions = 2; 
    bool public goalReached;
    bool public fundsWithdrawn;
    bool public campaignCanceled;
    bool public paused; // ✅ new state variable

    mapping(address => uint) public contributions;
    address[] private contributors;

    event ContributionReceived(address indexed contributor, uint amount);
    event GoalReached(uint totalAmountRaised);
    event SplitPayoutExecuted(address[] recipients, uint[] percentages);
    event EmergencyRefundExecuted(uint totalRefunded);
    event CampaignCanceled();
    event PartialWithdrawal(address indexed owner, uint amount);
    event RefundClaimed(address indexed contributor, uint amount);
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
    event Paused(address account);     // ✅ new event
    event Unpaused(address account);   // ✅ new event

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }
    modifier notCanceled() {
        require(!campaignCanceled, "Campaign canceled");
        _;
    }
    modifier whenNotPaused() {
        require(!paused, "Contributions are paused");
        _;
    }

    constructor(uint _goalAmount, uint _durationInDays) {
        owner = msg.sender;
        goalAmount = _goalAmount;
        deadline = block.timestamp + (_durationInDays * 1 days);
    }

    // ✅ modified contribute to enforce pause check
    function contribute() external payable notCanceled whenNotPaused {
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

    // (… other existing functions stay unchanged …)

    // 9. Transfer ownership
    function changeOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    // 10. Renounce ownership
    function renounceOwnership() external onlyOwner {
        address oldOwner = owner;
        owner = address(0);
        emit OwnershipTransferred(oldOwner, address(0));
    }

    // 11. ✅ NEW FUNCTIONS: Pause / Resume contributions
    function pauseContributions() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function resumeContributions() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }
}
