import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.0;

contract GaugeWeight {
    address public owner;
    mapping(address => uint256) WeightRecord;

    constructor() {
        owner = msg.sender;
    }

    modifier adminAccess() {
        require(msg.sender == owner, "Only owner can use this function");
        _;
    }

    function setWeight(address gaugeAddress, uint256 Weight)
        public
        adminAccess
    {
        WeightRecord[gaugeAddress] = Weight;
    }

    function getWeight(address gaugeAddress)
        public
        view
        returns (uint256 Weight)
    {
        return WeightRecord[gaugeAddress];
    }

}
