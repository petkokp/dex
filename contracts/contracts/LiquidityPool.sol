// SPDX-License-Identifier: MIT

pragma solidity >=0.8.10 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
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

    mapping(address => uint256) public poolOwnerBalance;
    mapping(address => bool) public tokenAddressWhitelisted;
    address public owner;
    uint256 public poolTotalValue = 0;
    uint256 public percScale = 1e18;
    uint256 private poolTotalDeposits = 0;
    uint256 constant PRECISION = 1_000_000;
    DexToken private _depositToken;

    bool allLPsCanWithdraw = true;
    event CapitalProvided(address optionsMarketAddress, uint256 amount);

    event Transfer(address from, address to, uint256 tokens);
    event Approval(address approver, address spender, uint256 amount);

    constructor() payable {
        owner = msg.sender;
    }

    function deposit(uint256 _amount1, uint256 _amount2)
        public
        payable
        returns (bool)
    {
        _depositToken.transferFrom(msg.sender, address(this), _amount1);

        (bool validShare, uint256 share) = AMM(msg.sender).provide(
            _amount1,
            _amount2,
            poolTotalDeposits
        );
        if (validShare) {
            transferFrom(msg.sender, address(this), _amount1);
            transferFrom(msg.sender, address(this), _amount2);

            poolOwnerBalance[msg.sender] = poolOwnerBalance[msg.sender] + share;
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

        (uint256 amount1, uint256 amount2, bool validShare) = AMM(msg.sender).withdraw(_amount, poolTotalDeposits);
        if (validShare) {
            transferFrom(address(this), msg.sender, amount1);
            transferFrom(address(this), msg.sender, amount2);
            return true;
        }

        return false;
    }
    
    /*
    function swap(uint _amount, address to) public returns (bool) {
        require(_amount > 0, "Cannot swap negative amount");


    }
    */

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
        poolOwnerBalance[sender] = poolOwnerBalance[sender].sub(amount);
        poolOwnerBalance[recipient] = poolOwnerBalance[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
        return true;
    }
}
