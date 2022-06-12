// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumer {

    AggregatorV3Interface internal priceFeedEth;

    constructor() {
        priceFeedEth = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
        // priceFeedDexToken = AggregatorV3Interface(/*address of DexToken*/);
    }
    
    function getLatestPriceEth() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
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