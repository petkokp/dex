// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

contract AMM {
    //uint totalShares;
    uint256 totalToken1;
    uint256 totalToken2;
    //above should be done with pool once implemented.

    uint256 K; // Algorithmic constant used to determine price (K = totalToken1 * totalToken2)

    uint256 constant PRECISION = 1_000_000;
    mapping(address => uint256) shares;
    mapping(address => uint256) token1Balance;
    mapping(address => uint256) token2Balance;

    constructor() {}

    modifier validAmountCheck(
        mapping(address => uint256) storage _balance,
        uint256 _quantity
    ) {
        require(_quantity > 0, "Amount cannot be zero!");
        require(_quantity <= _balance[msg.sender], "Insufficient amount");
        _;
    }

    // Restricts withdraw, swap feature until liquidity is added to the pool
    //move this func
    /*
    modifier activePool() {
        require(totalShares > 0, "Zero Liquidity");
        _;
    }
    */

    //could be moved to pool contract
    function getMyHoldings()
        external
        view
        returns (
            uint256 amountToken1,
            uint256 amountToken2,
            uint256 myShare
        )
    {
        amountToken1 = token1Balance[msg.sender];
        amountToken2 = token2Balance[msg.sender];
        myShare = shares[msg.sender];
    }

    //could be moved to pool contract
    /*
    function getPoolDetails()
        external
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        return (totalToken1, totalToken2, totalShares);
    }
    */

    // TODO REMOVE ME
    // Sends free tokens to caller to test with
    function faucet(uint256 _amountToken1, uint256 _amountToken2) external {
        uint256 tokens = token1Balance[msg.sender] + _amountToken1;
        token1Balance[msg.sender] = tokens;
        tokens = token2Balance[msg.sender] + _amountToken2;
        token2Balance[msg.sender] = tokens;
    }

    // function to add liquidity to pool
    function provide(
        uint256 _amountToken1,
        uint256 _amountToken2,
        uint256 poolTotalDeposits
    ) external returns (bool validShare, uint256 share) {
        validShare = false;
        if (poolTotalDeposits == 0) {
            share = 100 * PRECISION; // First liquidity provider
        } else {
            uint256 share1 = (poolTotalDeposits * _amountToken1) / totalToken1;
            uint256 share2 = (poolTotalDeposits * _amountToken2) / totalToken2;
            require(
                share1 == share2,
                "Provided tokens are not of equivalent value."
            );
            share = share1;
        }

        require(share > 0, "Asset value is not enough to contribute.");

        token1Balance[msg.sender] -= _amountToken1;
        token2Balance[msg.sender] -= _amountToken2;

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

        totalToken1 -= amountToken1;
        totalToken2 -= amountToken2;
        K = totalToken1 * totalToken2;

        token1Balance[msg.sender] += amountToken1;
        token2Balance[msg.sender] += amountToken2;
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
    function swapToken1(uint256 _amountToken1)
        external
        validAmountCheck(token1Balance, _amountToken1)
        returns (uint256 amountToken2)
    {
        amountToken2 = getSwapToken1Estimate(_amountToken1);

        token1Balance[msg.sender] -= _amountToken1;
        totalToken1 += _amountToken1;
        totalToken2 -= amountToken2;
        token2Balance[msg.sender] += amountToken2;
    }
}
