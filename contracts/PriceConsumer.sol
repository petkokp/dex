// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "hardhat/console.sol";

contract PriceConsumer {

    AggregatorV3Interface internal priceFeedEth;

    constructor(address ethUsd) {
        priceFeedEth = AggregatorV3Interface(ethUsd /* ETH-USD on Ropsten */);
        // priceFeedDexToken = AggregatorV3Interface(/*address of DexToken*/);
    }
    
    function getLatestPriceEth() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeedEth.latestRoundData();

        return price;
    }

    /*function getLatestPriceDexToken() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeedDexToken.latestRoundData();
        return price;
    }*/
}