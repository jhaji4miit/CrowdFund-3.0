// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleCrowdFund {
    mapping(address => uint) public contributions;

    // Accept contributions from anyone
    function contribute() external payable {
        require(msg.value > 0, "Contribution must be greater than zero");
        contributions[msg.sender] += msg.value;
    }

    // View total funds collected in the contract
    function getTotalFunds() external view returns (uint) {
        return address(this).balance;
    }

    // NEW FUNCTION: Allow users to withdraw their contribution
    function withdrawContribution() external {
        uint amount = contributions[msg.sender];
        require(amount > 0, "No funds to withdraw");
        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
