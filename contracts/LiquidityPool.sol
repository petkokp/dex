// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./DexToken.sol";
import "./AutomatedMarketMaker.sol";

contract LiquidityPool is ReentrancyGuard {
    using SafeMath for uint256;

    fallback() external payable {}

    receive() external payable {}

    uint256 public poolTotalValue = 0;
    uint256 private poolTotalFees = 0;

    uint256 private poolTotalDexFees = 0;
    uint256 private poolTotalEthFees = 0;

    uint256 private poolTotalProfitFromDex = 0;
    uint256 private poolTotalProfitFromEth = 0;

    uint256 private poolTotalProfitFromFees = 0;

    DexToken private __depositToken;
    AutomatedMarketMaker private __marketMaker;

    bool private isPoolInitialized = false;

    //event TokenSwapped(address account, address token, uint amountToken1, uint amountToken2);
    event Transfer(address from, address to, uint256 tokens);
    event Approval(address approver, address spender, uint256 amount);

    event ProvidedLP(
        address sender,
        address receiver,
        uint256 amount1,
        uint256 amount2
    );

    constructor(DexToken _token, AutomatedMarketMaker _amm) payable {
        __depositToken = _token;
        __marketMaker = _amm;
    }

    // for now _amount1 will be ETH and _amount2 will be dextoken hardcoded.
    function deposit(uint256 _dexAmount) external payable returns (bool) {
        require(_dexAmount > 0, "Invalid Amount");

        uint256 dexAmountMinusFee = ((_dexAmount * 10) -
            (_dexAmount * 3) /
            100) / 10;

        uint256 ethAmountMinusFee = msg.value - (msg.value * 3) / 1000;
        (bool validShare) = __marketMaker.provide(
            ethAmountMinusFee,
            dexAmountMinusFee
        );
        if (validShare) {
            __depositToken.transferFrom(
                msg.sender,
                address(this),
                dexAmountMinusFee
            );

            poolTotalValue += (ethAmountMinusFee + dexAmountMinusFee);
            poolTotalEthFees += msg.value - ethAmountMinusFee;
            poolTotalDexFees += _dexAmount - dexAmountMinusFee;
            poolTotalProfitFromEth += poolTotalEthFees / 4;
            poolTotalProfitFromDex += poolTotalDexFees / 4;

            __depositToken.burn((_dexAmount * 3) / 4000);

            emit ProvidedLP(
                msg.sender,
                address(this),
                ethAmountMinusFee,
                dexAmountMinusFee
            );
            return true;
        }
        return false;
    }

    function getPoolTotalValue() external view returns (uint256) {
        return poolTotalValue;
    }

    function getPoolTotalFees() external view returns (uint256) {
        return poolTotalFees;
    }

    function getPoolTotalProfitFromFees() external view returns (uint256) {
        return poolTotalProfitFromFees;
    }

    //_amount here is represented in %
    function withdraw(uint256 _amount) external nonReentrant returns (bool) {
        require(
            _amount > 0 && _amount <= 100,
            "You must withdraw a percentage between 0 and 100"
        );

        (uint256 weiAmount, uint256 dexAmount, bool validShare) = __marketMaker.withdraw(_amount);
        if (validShare) {
            uint256 dexAmountMinusFee = ((dexAmount * 10) -
                (dexAmount * 3) /
                100) / 10;

            uint256 ethAmountMinusFee = weiAmount - (weiAmount * 3) / 1000;

            poolTotalEthFees += weiAmount - ethAmountMinusFee;
            poolTotalDexFees += dexAmount - dexAmountMinusFee;
            poolTotalProfitFromEth += poolTotalEthFees / 4;
            poolTotalProfitFromDex += poolTotalDexFees / 4;

            __depositToken.burn((dexAmount * 3) / 4000);

            payable(msg.sender).transfer(weiAmount);
            __depositToken.transfer(msg.sender, dexAmount);
            return true;
        }

        return false;
    }

    //eth to dex
    function swapToken1ToToken2() external payable nonReentrant {
        require(msg.value > 0, "Amount cannot be zero!");

        //get swap rate
        uint256 estimatedTokens = __marketMaker.getSwapToken1Estimate(
            msg.value
        );
        require(
            __depositToken.balanceOf(address(this)) >= estimatedTokens,
            "Not Enough Funds"
        );

        //do the swap
        uint256 tokenAmount = __marketMaker.swapToken1(msg.value);

        //transfer dex to user
        //might be an issue in case we want to expand in the future?
        __depositToken.transfer(msg.sender, tokenAmount);
        //contract receives eth through msg.value

        //emit TokenSwapped(msg.sender, address(this), msg.value, tokenAmount);
    }

    //dex to eth

    function swapToken2ToToken1(uint256 _dexToken) external nonReentrant {
        require(_dexToken > 0, "Amount cannot be zero!");

        uint256 estimatedTokens = __marketMaker.getSwapToken2Estimate(
            _dexToken
        );
        require((address(this).balance) >= estimatedTokens, "Not Enough Funds");

        uint256 ethAmount = __marketMaker.swapToken2(_dexToken);

        //send eth to user
        payable(msg.sender).transfer(ethAmount);

        //get user's dextokens

        __depositToken.transferFrom(msg.sender, address(this), _dexToken);
        //emit TokenSwapped(address(this), msg.sender, ethAmount, msg.value);
    }
}
