// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CrowdfundV3 {
    address public owner;
    uint public campaignCounter;
    uint public platformFee = 2; // Platform takes 2% fee

    struct Campaign {
        address creator;
        string title;
        string description;
        uint goalAmount;
        uint deadline;
        uint totalRaised;
        bool withdrawn;
        bool active;
    }

    mapping(uint => Campaign) public campaigns;
    mapping(uint => mapping(address => uint)) public contributions;
    mapping(uint => address[]) public contributors;

    event CampaignCreated(uint campaignId, address creator, string title, uint goalAmount, uint deadline);
    event ContributionMade(uint campaignId, address contributor, uint amount);
    event FundsWithdrawn(uint campaignId, uint amount);
    event RefundClaimed(uint campaignId, address contributor, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        campaignCounter = 0;
    }

    function createCampaign(string memory _title, string memory _description, uint _goalAmount, uint _durationInDays) public {
        require(_goalAmount > 0, "Goal must be > 0");
        require(_durationInDays > 0, "Duration must be > 0");

        campaignCounter++;
        campaigns[campaignCounter] = Campaign({
            creator: msg.sender,
            title: _title,
            description: _description,
            goalAmount: _goalAmount,
            deadline: block.timestamp + (_durationInDays * 1 days),
            totalRaised: 0,
            withdrawn: false,
            active: true
        });

        emit CampaignCreated(campaignCounter, msg.sender, _title, _goalAmount, block.timestamp + (_durationInDays * 1 days));
    }

    function contribute(uint _campaignId) public payable {
        Campaign storage c = campaigns[_campaignId];
        require(c.active, "Campaign inactive");
        require(block.timestamp <= c.deadline, "Deadline passed");
        require(msg.value > 0, "Contribution must be > 0");

        if (contributions[_campaignId][msg.sender] == 0) {
            contributors[_campaignId].push(msg.sender);
        }

        contributions[_campaignId][msg.sender] += msg.value;
        c.totalRaised += msg.value;

        emit ContributionMade(_campaignId, msg.sender, msg.value);
    }

    function withdrawFunds(uint _campaignId) public {
        Campaign storage c = campaigns[_campaignId];
        require(msg.sender == c.creator, "Not creator");
        require(block.timestamp > c.deadline, "Campaign still active");
        require(c.totalRaised >= c.goalAmount, "Goal not reached");
        require(!c.withdrawn, "Already withdrawn");

        uint fee = (c.totalRaised * platformFee) / 100;
        uint amount = c.totalRaised - fee;

        c.withdrawn = true;
        c.active = false;

        payable(owner).transfer(fee);
        payable(c.creator).transfer(amount);

        emit FundsWithdrawn(_campaignId, amount);
    }

    function claimRefund(uint _campaignId) public {
        Campaign storage c = campaigns[_campaignId];
        require(block.timestamp > c.deadline, "Campaign not ended");
        require(c.totalRaised < c.goalAmount, "Goal met - no refund");
        uint contributed = contributions[_campaignId][msg.sender];
        require(contributed > 0, "No contributions");

        contributions[_campaignId][msg.sender] = 0;
        payable(msg.sender).transfer(contributed);

        emit RefundClaimed(_campaignId, msg.sender, contributed);
    }

    function getCampaignContributors(uint _campaignId) public view returns (address[] memory) {
        return contributors[_campaignId];
    }

    function getCampaignDetails(uint _campaignId) public view returns (
        string memory, string memory, uint, uint, uint, bool, bool
    ) {
        Campaign storage c = campaigns[_campaignId];
        return (
            c.title,
            c.description,
            c.goalAmount,
            c.deadline,
            c.totalRaised,
            c.withdrawn,
            c.active
        );
    }

    function getAllCampaigns() public view returns (uint[] memory) {
        uint[] memory ids = new uint[](campaignCounter);
        for (uint i = 1; i <= campaignCounter; i++) {
            ids[i-1] = i;
        }
        return ids;
    }
}
