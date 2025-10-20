// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleCrowdFund {
    mapping(address => uint) public contributions;
    address public owner;
    bool public paused;
    address[] private contributorList; // To track unique contributors

    constructor() {
        owner = msg.sender;
    }

    // Accept contributions from anyone (pausable)
    function contribute() external payable {
        require(!paused, "Contributions are paused");
        require(msg.value > 0, "Contribution must be greater than zero");
        if (contributions[msg.sender] == 0) {
            contributorList.push(msg.sender);
        }
        contributions[msg.sender] += msg.value;
    }

    // View total funds collected in the contract
    function getTotalFunds() external view returns (uint) {
        return address(this).balance;
    }

    // Allow users to withdraw their contribution
    function withdrawContribution() external {
        uint amount = contributions[msg.sender];
        require(amount > 0, "No funds to withdraw");
        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    // View your own contributed amount
    function viewMyContribution() external view returns (uint) {
        return contributions[msg.sender];
    }
        }
    }
}
