// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

contract AutomatedMarketMaker {
    uint256 totalToken1;
    uint256 totalToken2;

    mapping(address => uint256) token1Balance;
    mapping(address => uint256) token2Balance;

    uint256 K; // Algorithmic constant used to determine price (K = totalToken1 * totalToken2)

    constructor() {}

    // function to add liquidity to pool
    function provide(
        uint256 _amountToken1,
        uint256 _amountToken2,
        uint256 poolTotalDeposits
    ) external returns (bool validShare, uint256 share) 
    {
        validShare = false;
        if (poolTotalDeposits == 0) {
            share = 100; //first LP
        } else {
            uint256 share1 = (poolTotalDeposits * _amountToken1) / totalToken1;
            uint256 share2 = (poolTotalDeposits * _amountToken2) / totalToken2;
            require(share1 == share2, "Provided tokens are not of equivalent value.");
            share = share1;
        }

        require(share > 0, "Asset value is not enough to contribute.");

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

    // functions to remove liquidity
    function getWithdrawEstimate(uint256 _share, uint256 poolTotalDeposits)
        public
        view
        returns (uint256 amountToken1, uint256 amountToken2)
    {
        require(
            _share <= poolTotalDeposits,
            "Share should be less than totalShare"
        );
        amountToken1 = (_share * totalToken1) / poolTotalDeposits;
        amountToken2 = (_share * totalToken2) / poolTotalDeposits;
    }

    function withdraw(uint256 _share, uint256 poolTotalDeposits)
        external
        returns (uint256 amountToken1, uint256 amountToken2, bool validShare)
    {
        validShare = false;
        (amountToken1, amountToken2) = getWithdrawEstimate(
            _share,
            poolTotalDeposits
        );

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
        if (amountToken2 == totalToken2) {
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
