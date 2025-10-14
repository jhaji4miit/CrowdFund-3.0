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

    // View the contributed amount of any address
    function viewContribution(address user) external view returns (uint) {
        return contributions[user];
    }

    // Refund all contributors (only owner)
    function refundAll(address[] memory contributorsList) external {
        require(msg.sender == owner, "Only owner can refund all");
        for (uint i = 0; i < contributorsList.length; i++) {
            address contributor = contributorsList[i];
            uint amount = contributions[contributor];
            if (amount > 0) {
                contributions[contributor] = 0;
                payable(contributor).transfer(amount);
            }
        }
    }

    // Withdraw remaining unclaimed funds (only owner)
    function withdrawUnclaimedFunds() external {
        require(msg.sender == owner, "Only owner can withdraw unclaimed funds");
        payable(owner).transfer(address(this).balance);
    }

    // Transfer contract ownership to another address
    function changeOwner(address newOwner) external {
        require(msg.sender == owner, "Only owner can transfer ownership");
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}
