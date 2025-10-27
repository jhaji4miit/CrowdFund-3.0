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
}
