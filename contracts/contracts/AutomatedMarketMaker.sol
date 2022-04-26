// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

contract AMM {
    uint totalShares;
    uint totalToken1;
    uint totalToken2;
    //above should be done with pool once implemented.

    uint K; // Algorithmic constant used to determine price (K = totalToken1 * totalToken2)

    uint constant PRECISION = 1_000_000;
    mapping(address => uint) shares;
    mapping(address => uint) token1Balance;
    mapping(address => uint) token2Balance;

    
    modifier validAmountCheck(mapping(address => uint256) storage _balance, uint _quantity) {
        require(_quantity > 0, "Amount cannot be zero!");
        require(_quantity <= _balance[msg.sender], "Insufficient amount");
        _;
    }

    // Restricts withdraw, swap feature until liquidity is added to the pool
    modifier activePool() {
        require(totalShares > 0, "Zero Liquidity");
        _;
    }

    //could be moved to pool contract
    function getMyHoldings() external view returns (uint amountToken1, uint amountToken2, uint myShare) {
        amountToken1 = token1Balance[msg.sender];
        amountToken2 = token2Balance[msg.sender];
        myShare = shares[msg.sender];
    }

    //could be moved to pool contract
    function getPoolDetails() external view returns (uint, uint, uint) {
        return (totalToken1, totalToken2, totalShares);
    }

    // TODO REMOVE ME
    // Sends free tokens to caller to test with
    function faucet(uint _amountToken1, uint _amountToken2) external {
        uint tokens = token1Balance[msg.sender] + _amountToken1;
        token1Balance[msg.sender] = tokens;
        tokens = token2Balance[msg.sender] + _amountToken2;
        token2Balance[msg.sender] = tokens;
    }

    // function to add liquidity to pool
    function provide(uint _amountToken1, uint _amountToken2) external 
        validAmountCheck(token1Balance, _amountToken1)
        validAmountCheck(token2Balance, _amountToken2)
        returns (uint share) {

        if (totalShares == 0) {
            share = 100 * PRECISION; // First liquidity provider
        }
        else {
            uint share1 = (totalShares * _amountToken1) / totalToken1;
            uint share2 = (totalShares * _amountToken2) / totalToken2;
            require(share1 == share2, "Provided tokens are not of equivalent value.");
            share = share1;
        }

        require(share > 0, "Asset value is not enough to contribute.");
        token1Balance[msg.sender] -= _amountToken1;
        token2Balance[msg.sender] -= _amountToken2;

        totalToken1 += _amountToken1;
        totalToken2 += _amountToken2;
        K = totalToken1 * totalToken2;

        totalShares += share;
        shares[msg.sender] += share;
    }

    
    function getEquivalentToken1Estimate(uint256 _amountToken2) public view activePool returns (uint reqToken1) {
        reqToken1 = (totalToken1 * _amountToken2) / totalToken2;
    }
    function getEquivalentToken2Estimate(uint256 _amountToken1) public view activePool returns (uint reqToken2) {
        reqToken2 = (totalToken2 * _amountToken1) / totalToken1;
    }

    // functions to remove liquidity
    function getWithdrawEstimate(uint _share) public view activePool returns (uint amountToken1, uint amountToken2) {
        require(_share <= totalShares, "Share should be less than totalShare");
        amountToken1 = (_share * totalToken1) / totalShares;
        amountToken2 = (_share * totalToken2) / totalShares;
    }
    function withdraw(uint _share) external
        activePool
        validAmountCheck(shares, _share)
        returns (uint amountToken1, uint amountToken2) {
            
            (amountToken1, amountToken2) = getWithdrawEstimate(_share);
            shares[msg.sender] -= _share;
            totalShares -= _share;
            
            totalToken1 -= amountToken1;
            totalToken2 -= amountToken2;
            K = totalToken1 * totalToken2;

            token1Balance[msg.sender] += amountToken1;
            token2Balance[msg.sender] += amountToken2;
    }

    // returns how much token2 user will get swapping token1 to token2
    function getSwapToken1Estimate(uint _amountToken1) public view activePool returns (uint amountToken2) {
        uint token1After = totalToken1 + _amountToken1;
        uint token2After = K / token1After;
        amountToken2 = totalToken2 - token2After;

        // To ensure that Token2's pool is not completely depleted leading to inf:0 ratio
        if (amountToken2 == totalToken2) {
            amountToken2--;
        }
    }

    // returns how much token1 is needed to get X amount of token2 
    function getSwapToken1EstimateGivenToken2(uint _amountToken2) public view activePool returns (uint amountToken1) {
        require(_amountToken2 < totalToken2, "Insufficient pool balance");
        uint token2After = totalToken2 - _amountToken2;
        uint token1After = K / token2After;
        amountToken1 = token1After - totalToken1;
    }

    // Swaps given amount of Token1 to Token2 using algorithmic price determination
    function swapToken1(uint _amountToken1) external 
        activePool 
        validAmountCheck(token1Balance, _amountToken1) 
        returns(uint amountToken2) {

        amountToken2 = getSwapToken1Estimate(_amountToken1);

        token1Balance[msg.sender] -= _amountToken1;
        totalToken1 += _amountToken1;
        totalToken2 -= amountToken2;
        token2Balance[msg.sender] += amountToken2;
    }
}