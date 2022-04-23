// SPDX-License-Identifier: MIT

pragma solidity >=0.8.10 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./DexToken.sol";

contract LiquidityPool is ReentrancyGuard {
    using SafeMath for uint256;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can complete this tx");
        _;
    }

    fallback() external payable {}
    receive() external payable {}

    mapping(address => uint256) public poolOwnerBalance;
    mapping(address => bool) public tokenAddressWhitelisted;
    address public owner;
    uint256 public poolTotalValue = 0;
    uint256 public percScale = 1e18;
    uint256 public poolTotalDeposits = 0;
    DexToken private _depositToken;

    address public optionsMarketContract = address(0x0);
    uint256 maxPercentageCapitalForAnyPosition = 2000;
    uint256 withdrawalDate = 0;
    bool allLPsCanWithdraw = true;
    event CapitalProvided(address optionsMarketAddress, uint256 amount);

    event Transfer(address from, address to, uint256 tokens);
    event Approval(address approver, address spender, uint256 amount);

    constructor() payable {
        owner = msg.sender;
    }

    function setDepositToken(DexToken token) public onlyOwner {
        _depositToken = token;
    }

    function setWithdrawDate(uint256 date) public onlyOwner returns (bool) {
        require(date == 0, "Owner cannot change the withdrawal date");
        withdrawalDate = date;
        return true;
    }

    function updateCapitalPercMaxForAnyPosition(uint256 percentage)
        public
        onlyOwner
        returns (bool)
    {
        maxPercentageCapitalForAnyPosition = percentage;
        return true;
    }

    function deposit(uint256 amount) public payable returns (bool) {
        require(
            _depositToken.transferFrom(msg.sender, address(this), amount),
            "You must have the balance of the deposit token and have approved this contract before doing this"
        );
        poolTotalDeposits = poolTotalDeposits.add(amount);
        poolTotalValue = poolTotalValue.add(amount);
        poolOwnerBalance[msg.sender] = poolOwnerBalance[msg.sender].add(amount);
        return true;
    }

    function calculatePercentage(uint256 _amount)
        internal
        view
        returns (uint256)
    {
        return ((_amount.mul(percScale)).mul(100).div(poolTotalDeposits));
    }

    function withdraw(uint256 amount) public returns (bool) {
        require(
            allLPsCanWithdraw,
            "allLPsCanWithdraw must be set to true for LPs to withdraw"
        );
        uint256 userPercentageOfDepositsAsPercScale = calculatePercentage(
            amount
        );
        uint256 amountOutputTokensEntitledTo = (
            poolTotalValue.mul(userPercentageOfDepositsAsPercScale)
        ).div(percScale).div(100);
        poolOwnerBalance[msg.sender] = poolOwnerBalance[msg.sender].sub(amount);
        poolTotalDeposits = poolTotalDeposits.sub(amount);
        poolTotalValue = poolTotalValue.sub(amountOutputTokensEntitledTo);
        _depositToken.transfer(msg.sender, amountOutputTokensEntitledTo);
        return true;
    }

    function releaseCapitalAndRewardsForLPClaim() public returns (bool) {
        if (block.timestamp > withdrawalDate) {
            allLPsCanWithdraw = true;
        }
        return true;
    }

    function whitelistToken(address tokenAddress)
        public
        payable
        onlyOwner
        returns (bool)
    {
        tokenAddressWhitelisted[tokenAddress] = true;
        return true;
    }

    function provideCapitalForOptionOrder(
        DexToken token,
        uint256 amountOutputToken
    ) public {
        require(
            msg.sender == optionsMarketContract,
            "only the authorized options market can make requests to this contract for liquidity"
        );
        bool authorized = isWhitelistedToken(token);
        require(authorized, "This token is not authorized for this pool");

        if (token != _depositToken) {
            uint256 calculatedInputAmount = swapRate(
                _depositToken,
                token,
                amountOutputToken
            );
            uint256 percentageOfTotalDeposits = calculatedInputAmount
                .mul(1000)
                .div(poolTotalValue);
            require(
                percentageOfTotalDeposits <= maxPercentageCapitalForAnyPosition,
                "This amount of liquidity cannot be provided for a single transaction"
            );
        }
        token.transfer(optionsMarketContract, amountOutputToken);
        emit CapitalProvided(optionsMarketContract, amountOutputToken);
    }

    function swapRate(
        DexToken tokenFrom,
        DexToken tokenTo,
        uint256 amount
    ) public pure returns (uint256) {
        uint256 swapRate;
        return swapRate;
    }

    function updateOwnerDAO(address newDAO) public onlyOwner returns (bool) {
        owner = newDAO;
        return true;
    }

    function swapForAmount(
        DexToken theDepositToken,
        DexToken token,
        uint256 amountOutputToken
    ) public pure returns (uint256) {
        return amountOutputToken;
    }

    function isWhitelistedToken(DexToken token) public view returns (bool) {
        if (tokenAddressWhitelisted[address(token)] == true) {
            return true;
        } else {
            return false;
        }
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        _depositToken.approve(spender, amount);
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(poolOwnerBalance[msg.sender] >= amount, "Insufficient funds");
        require(recipient != address(0), "This address does not exist");
        _depositToken.transferFrom(msg.sender, recipient, amount);
        poolOwnerBalance[msg.sender] = poolOwnerBalance[msg.sender].add(amount);
        poolOwnerBalance[recipient] = poolOwnerBalance[recipient].sub(amount);
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public returns (bool) {
        require(poolOwnerBalance[sender] >= amount, "Insufficient funds");
        require(recipient != address(0), "This address does not exist");
        _depositToken.transferFrom(sender, recipient, amount);
        poolOwnerBalance[sender] = poolOwnerBalance[sender].add(amount);
        poolOwnerBalance[recipient] = poolOwnerBalance[recipient].sub(amount);
        emit Transfer(sender, recipient, amount);
        return true;
    }
}