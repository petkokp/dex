// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract AutomatedMarketMaker {
    uint256 public totalToken1;
    uint256 public totalToken2;

    mapping(address => uint256) token1Balance; //eth balance
    mapping(address => uint256) token2Balance;

    uint256 private K; // Algorithmic constant used to determine price (K = totalToken1 * totalToken2)

    uint256[2] public tokenRatio;

    constructor() {}
    
    // function to add liquidity to pool
    function provide(
        uint256 _amountToken1,
        uint256 _amountToken2
    ) external returns (bool validShare) 
    {
        validShare = false;
        if (K == 0) {
            //first LP
            tokenRatio[0] = _amountToken1;
            tokenRatio[1] = _amountToken1;
        } else {
            uint newRatio1 = tokenRatio[0] + _amountToken1;
            uint newRatio2 = tokenRatio[1] + _amountToken2;

            require(newRatio1 / newRatio2 == tokenRatio[0] / tokenRatio[1], "Provided tokens are not of equivalent value.");
            tokenRatio[0] = newRatio1;
            tokenRatio[1] = newRatio2;
        }

        token1Balance[msg.sender] += _amountToken1;
        token2Balance[msg.sender] += _amountToken2;        

        totalToken1 += _amountToken1;
        totalToken2 += _amountToken2;
        K = totalToken1 * totalToken2;

        validShare = true;
    }

    function getEquivalentToken1Estimate(uint256 _amountToken2)
        public
        view
        returns (uint256 reqToken1)
    {
        reqToken1 = (totalToken1 * _amountToken2) / totalToken2;
    }

    function getEquivalentToken2Estimate(uint256 _amountToken1)
        public
        view
        returns (uint256 reqToken2)
    {
        reqToken2 = (totalToken2 * _amountToken1) / totalToken1;
    }

    function withdraw(uint256 _share)
        external
        returns (uint256 amountToken1, uint256 amountToken2, bool validShare)
    {
        validShare = false;
        require(token1Balance[msg.sender] > 0 && token2Balance[msg.sender] > 0, "You do not have anything to withdraw");        

        amountToken1 = (token1Balance[msg.sender] * _share) / 100;
        amountToken2 = (token2Balance[msg.sender] * _share) / 100;       

        token1Balance[msg.sender] -= amountToken1;
        token2Balance[msg.sender] -= amountToken2;

        totalToken1 -= amountToken1;
        totalToken2 -= amountToken2; 
        K = totalToken1 * totalToken2;

        validShare = true;
    }

    // returns how much token2 user will get swapping token1 to token2
    function getSwapToken1Estimate(uint256 _amountToken1)
        public
        view
        returns (uint256 amountToken2)
    {
        uint256 token1After = totalToken1 + _amountToken1;
        uint256 token2After = K / token1After;
        amountToken2 = totalToken2 - token2After;
        // To ensure that Token2's pool is not completely depleted leading to inf:0 ratio
        if (amountToken2 == totalToken2 && totalToken2 != 0) {
            amountToken2--;
        }
    }

    // returns how much token1 is needed to get X amount of token2
    function getSwapToken1EstimateGivenToken2(uint256 _amountToken2)
        public
        view
        returns (uint256 amountToken1)
    {
        require(_amountToken2 < totalToken2, "Insufficient pool balance");
        uint256 token2After = totalToken2 - _amountToken2;
        uint256 token1After = K / token2After;
        amountToken1 = token1After - totalToken1;
    }

    // Swaps given amount of Token1 to Token2 using algorithmic price determination
    function swapToken1(uint256 _amountToken1) external returns (uint256 amountToken2) {
        amountToken2 = getSwapToken1Estimate(_amountToken1);

        totalToken1 += _amountToken1;
        totalToken2 -= amountToken2;

        token1Balance[msg.sender] -= _amountToken1;
        token2Balance[msg.sender] += amountToken2;
    }


    function getSwapToken2Estimate(uint256 _amountToken2)
        public
        view
        returns (uint256 amountToken1)
    {
        uint256 token2After = totalToken2 + _amountToken2;
        uint256 token1After = K / token2After;
        amountToken1 = totalToken1 - token1After;

        if (amountToken1 == totalToken1) {
            amountToken1--;
        }
    }

    function getSwapToken2EstimateGivenToken1(uint256 _amountToken1)
        public
        view
        returns (uint256 amountToken2)
    {
        require(_amountToken1 < totalToken1, "Insufficient pool balance");
        uint256 token1After = totalToken1 - _amountToken1;
        uint256 token2After = K / token1After;
        amountToken2 = token2After - totalToken2;
    }

    function swapToken2(uint256 _amountToken2) external returns (uint256 amountToken1) {
        amountToken1 = getSwapToken2Estimate(_amountToken2);

        totalToken1 -= amountToken1;
        totalToken2 += _amountToken2;

        token1Balance[msg.sender] += amountToken1;
        token2Balance[msg.sender] -= _amountToken2;
    }
}
