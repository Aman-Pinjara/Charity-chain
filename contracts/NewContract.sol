// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.17;

contract MyContract {
    uint public charity_count = 0;
    uint public constant charity_creation_price = 0.1 ether;

    struct Charity {
        uint id;
        string name;
        string description;
        address payable owner;
        uint donation_received;
    }

    Charity[] public charities;

    function getCharities() public view returns(Charity[] memory) {
        return charities;
    }

    function createCharity(string memory _name, string memory _description) payable public {
        require(msg.value == charity_creation_price);
        Charity memory charity = Charity(
            charity_count,
            _name,
            _description,
            payable(msg.sender),
            0
        );
        charity_count++;
        charities.push(charity);
    }

    function donate(uint _id) payable public {
        require(_id >= 0 && _id <= charity_count);
        // Charity memory _charity = ;
        address payable _owner = payable(charities[_id].owner);
        payable(address(_owner)).transfer(msg.value);
        charities[_id].donation_received += msg.value;
    }

  
}