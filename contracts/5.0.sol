// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleCrowdFund {
    mapping(address => uint) public contributions;

    // Accept contributions from anyone
    function contribute() external payable {
        require(msg.value > 0, "Contribution must be greater than zero");
        contributions[msg.sender] += msg.value;
    }

    // NEW FUNCTION: View total funds collected in the contract
    function getTotalFunds() external view returns (uint) {
        return address(this).balance;
    }
}
