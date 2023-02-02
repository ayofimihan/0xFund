//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./PriceConverter.sol";
//Get funds from users
//withdraw funds
//set a minimum funding value

//custom errors are stated outside of the contracts
error Brokie();

contract FundMe {
    using PriceConverter for uint256;
    //minimum ethUSD value that can be sent to the contract
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    //an array of all funders
    address[] public funders;
    //a mapping of all funder addresses to amount they funded.
    mapping(address => uint256) public funderToAmount;
    //use immutable on a constructor variable name that doesn't change.
    address public immutable i_owner;
    AggregatorV3Interface public priceFeed;

    //constructor to set the owner when deploying the contract. the "i_" shows immutability which is on the variable name during declaration.
    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    //a modi fier that checks to make sure the person about to call a function is the owner of the contract
    modifier onlyOwner() {
        require(i_owner == msg.sender, "you're not the owner dawg");
        _;
    }

    //function to fund the contract
    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "get your money up"
        );
        funders.push(msg.sender);
        funderToAmount[msg.sender] = msg.value;
    }

    //function to withdraw from the contract only by the owner.
    function withdraw(address _to) public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            funderToAmount[funder] = 0;
        }
        funders = new address[](0);
        //this line withdraws the funds to the _to address
        (bool success, ) = payable(_to).call{value: address(this).balance}("");
        //revert is used here to save gas and error brokie is declared already outside of the contract
        if (!success) {
            revert Brokie();
        }
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
