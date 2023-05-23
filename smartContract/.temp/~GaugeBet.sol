pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/~IERC20.sol";
import "@openzeppelin/contracts/access/~Ownable.sol";

interface ICurveGauge {
    function getWeight(address gaugeAddress) external view returns (uint256);
}

contract GaugeWeightBetting is Ownable {
    event BettingClosed(
        address winner_3Pool,
        address winner_steth,
        address winner_paxosDollar
    );

    struct Bet {
        uint256 gaugeWeight_3Pool;
        uint256 gaugeWeight_steth;
        uint256 gaugeWeight_paxosDollar;
    }

    uint256 public bettingEndTime;
    uint256 public actualGaugeWeight;
    uint256 private numberAround;
    uint256 private numberOfParticipants;
    uint8 constant TOKEN_DECIMALS = 18;

    IERC20 public usdc;
    ICurveGauge public curveGauge;

    address constant USDC_TOKEN_ADDRESS =
        0x233175cecC981aedDcFbe4fB15A462B221f3C8C0;
    IERC20 constant USDC_TOKEN = IERC20(USDC_TOKEN_ADDRESS);

    address gaugeWeight_3PoolAddress =
        0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A;
    address gaugeWeight_stethAddress =
        0x182B723a58739a9c974cFDB385ceaDb237453c28;
    address gaugeWeight_paxosDollarAddress =
        0xC95bdf13A08A547E4dD9f29B00aB7fF08C5d093d;
    address curveGaugeAddress = 0x1dC4B7f971AfD1195f94cc57c85987223d940aC4;

    mapping(address => Bet) public bets;
    mapping(uint256 => mapping(address => bool))
        public participationStatus_user;
    mapping(uint256 => address[]) public bettorList;
    mapping(uint256 => bool) public isBettingClosed;
    address[] public bettors;
    mapping(uint256 => address) winner;

    constructor(uint256 _bettingDuration) {
        curveGauge = ICurveGauge(curveGaugeAddress);
        bettingEndTime = block.timestamp + _bettingDuration;
        numberAround = 1;
    }

    modifier checkUniqueParticipant() {
        require(
            participationStatus_user[numberAround][msg.sender] != true,
            "Participant has already deposited"
        );
        _;
    }

    function get_weight(address weightAddress) public view returns (uint256) {
        return curveGauge.getWeight(weightAddress);
    }

    function _depositUSDC() private checkUniqueParticipant {
        uint256 amount = 10 * (10**uint256(TOKEN_DECIMALS));

        bool transferred = USDC_TOKEN.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(transferred, "USDC transfer failed");
    }

    function _depositToWinner(address[] memory winners) private onlyOwner {
        require(isBettingClosed[numberAround], "Betting has stil open");
        uint256 balance = getBalance_contract();
        require(balance > 0, "Insufficient balance");
        uint256 dividedAmount = balance / 3;
        require(
            USDC_TOKEN.transfer(winners[0], dividedAmount),
            "Failed to transfer USDC to address1"
        );
        require(
            USDC_TOKEN.transfer(winners[1], dividedAmount),
            "Failed to transfer USDC to address2"
        );
        require(
            USDC_TOKEN.transfer(winners[2], dividedAmount),
            "Failed to transfer USDC to address3"
        );
    }

    function PlaceBet(Bet calldata bet) external checkUniqueParticipant {
        require(numberOfParticipants < 15, "Maximum number of users reached");
        _depositUSDC();
        bets[msg.sender] = bet;
        bettorList[numberAround].push(msg.sender);
        participationStatus_user[numberAround][msg.sender] = true;
        numberOfParticipants++;
    }

    function CloseBetting() external onlyOwner {        
        uint256 gaugeWeight_3Pool = get_weight(gaugeWeight_3PoolAddress);
        uint256 gaugeWeight_steth = get_weight(gaugeWeight_stethAddress);
        uint256 gaugeWeight_paxosDollar = get_weight(
            gaugeWeight_paxosDollarAddress
        );

        uint256 closestDifference_3Pool = type(uint256).max;
        uint256 closestDifference_steth = type(uint256).max;
        uint256 closestDifference_paxosDollar = type(uint256).max;

        address winner_3Pool;
        address winner_steth;
        address winner_paxosDollar;

        for (uint256 i = 0; i < bettorList[numberAround].length; i++) {
            address bettor = bettorList[numberAround][i];
            uint256 difference_3Pool = _absoluteDifference(
                bets[bettor].gaugeWeight_3Pool,
                gaugeWeight_3Pool
            );
            uint256 difference_steth = _absoluteDifference(
                bets[bettor].gaugeWeight_steth,
                gaugeWeight_steth
            );
            uint256 difference_paxosDollar = _absoluteDifference(
                bets[bettor].gaugeWeight_paxosDollar,
                gaugeWeight_paxosDollar
            );

            if (difference_3Pool < closestDifference_3Pool) {
                closestDifference_3Pool = difference_3Pool;
                winner_3Pool = bettor;
            }

            if (difference_steth < closestDifference_steth) {
                closestDifference_steth = difference_steth;
                winner_steth = bettor;
            }

            if (difference_paxosDollar < closestDifference_paxosDollar) {
                closestDifference_paxosDollar = difference_paxosDollar;
                winner_paxosDollar = bettor;
            }
        }

        numberAround++;
        numberOfParticipants = 0;
        address[] memory winners = new address[](3);
        winners[0] = winner_3Pool;
        winners[1] = winner_steth;
        winners[2] = winner_paxosDollar;

        _depositToWinner(winners);
        emit BettingClosed(winner_3Pool, winner_steth, winner_paxosDollar);
    }

    function isWinner(address user) public view returns (bool) {
        return user == winner[numberAround];
    }

    function getBalance_contract() public view returns (uint256) {
        uint256 balance = USDC_TOKEN.balanceOf(address(this));
        return balance;
    }
        function printAddress(uint256 around)
        public
        view
        returns (address[] memory)
    {
        for (uint256 i = 0; i < bettorList[numberAround].length; i++) {
            address bettor = bettors[i];
        }

        return bettorList[around];
    }


    function _absoluteDifference(uint256 a, uint256 b)
        internal
        pure
        returns (uint256)
    {
        return a > b ? a - b : b - a;
    }
}
