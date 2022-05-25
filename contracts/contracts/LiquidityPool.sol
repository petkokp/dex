// SPDX-License-Identifier: MIT

pragma solidity >=0.8.10 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./DexToken.sol";
import "./AutomatedMarketMaker.sol";

contract LiquidityPool is ReentrancyGuard {
    using SafeMath for uint256;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can complete this tx");
        _;
    }

    fallback() external payable {}

    receive() external payable {}

    mapping(address => bool) public tokenAddressWhitelisted;
    address public owner;
    uint256 public poolTotalValue = 0;
    uint256 private poolTotalDeposits = 0;


    ERC20 private __depositToken;
    AutomatedMarketMaker private __marketMaker;

    bool allLPsCanWithdraw = true;
    event CapitalProvided(address optionsMarketAddress, uint256 amount);
    event TokenSwapped(address account, address token, uint amountToken1, uint amountToken2);
    event Transfer(address from, address to, uint256 tokens);
    event Approval(address approver, address spender, uint256 amount);

    //crashes with param?
    constructor(ERC20 _token) payable {
        __depositToken = _token;
        __marketMaker = new AutomatedMarketMaker();
    }

    //for now _amount1 will be ETH and _amount2 will be dextoken hardcoded.
    function deposit(uint256 _amount1, uint256 _amount2)
        public
        payable
        returns (bool)
    {
        require(_amount1 > 0 && _amount2 > 0, "Invalid Amount");

        (bool validShare, uint256 share) = __marketMaker.provide(
            _amount1,
            _amount2,
            poolTotalDeposits
        );
        if (validShare) {
            __depositToken.transferFrom(msg.sender, address(this), _amount1);
            __depositToken.transferFrom(msg.sender, address(this), _amount2);            

            poolTotalDeposits += share;
            poolTotalValue += (_amount1 + _amount2);
            return true;
        }
        return false;
    }

    //_amount here is represented in %
    function withdraw(uint256 _amount) public returns (bool) {
        require(
            _amount > 0 && _amount <= 100,
            "You must withdraw a percentage between 0 and 100"
        );

        (uint256 amount1, uint256 amount2, bool validShare) = __marketMaker.withdraw(_amount, poolTotalDeposits);
        if (validShare) {
            payable(msg.sender).transfer(amount1); 
            __depositToken.transferFrom(address(this), msg.sender, amount2);
            return true;
        }

        return false;
    }
    

    function swapToken1ToToken2() external payable {
        require(msg.value > 0, "Amount cannot be zero!");

        //get swap rate
        uint estimatedTokens = __marketMaker.getSwapToken1Estimate(msg.value);
        require(__depositToken.balanceOf(address(this)) >= estimatedTokens);

        //do the swap
        uint tokenAmount = __marketMaker.swapToken1(msg.value);
        //transfer - might be an issue in case we want to expand in the future?
        __depositToken.transferFrom(address(this), msg.sender, tokenAmount);
        emit TokenSwapped(msg.sender, address(__depositToken), msg.value, tokenAmount);
    }

    //WIP DONT USE
    /*
    function swapToken2ToToken1() external payable {
        require(msg.value > 0, "Amount cannot be zero!");

        //get swap rate
        uint estimatedTokens = __marketMaker.getSwapToken1Estimate(msg.value);
        require(__depositToken.balanceOf(address(this)) >= estimatedTokens);

        //do the swap
        uint tokenAmount = __marketMaker.swapToken1(msg.value);
        //transfer - might be an issue in case we want to expand in the future?
        __depositToken.transferFrom(address(this), msg.sender, tokenAmount);
        emit TokenSwapped(msg.sender, address(__depositToken), msg.value, tokenAmount);
    }
    */
}
