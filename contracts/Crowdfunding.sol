// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    address public owner;
    uint public goal;
    uint public deadline;
    uint public raised;

    mapping(address => uint) public contributions;

    constructor(uint _goalInWei, uint _durationInSeconds) {
        owner = msg.sender;
        goal = _goalInWei;
        deadline = block.timestamp + _durationInSeconds;
    }

    // 1. Contribute to the campaign
    function contribute() external payable {
        require(block.timestamp < deadline, "Campaign ended");
        require(msg.value > 0, "Must send ETH");
        contributions[msg.sender] += msg.value;
        raised += msg.value;
    }

    // 2. Withdraw funds if goal is met
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(block.timestamp >= deadline, "Campaign not ended");
        require(raised >= goal, "Goal not reached");
        payable(owner).transfer(address(this).balance);
    }

    // 3. Refund if goal not met
    function refund() external {
        require(block.timestamp >= deadline, "Campaign not ended");
        require(raised < goal, "Goal was met");
        uint amount = contributions[msg.sender];
        require(amount > 0, "Nothing to refund");
        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    // 4. Get time remaining (in seconds)
    function getTimeLeft() external view returns (uint) {
        if (block.timestamp >= deadline) {
            return 0;
        } else {
            return deadline - block.timestamp;
        }
    }

    // 5. Check if funding goal has been reached
    function isGoalReached() external view returns (bool) {
        return raised >= goal;
    }
}
