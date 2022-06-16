// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DexToken is ERC20, Ownable {
  string _name = 'Dex Token';
  string _symbol = 'DEX';
  uint256 private supply = 100_000_000;

  constructor() ERC20(_name, _symbol) {
    _mint(msg.sender, supply);
  }

  function getMaxSupply() public view returns (uint256) {
    return supply;
  }

  function mint(address to, uint256 amount) public onlyOwner {
    require(totalSupply() + amount <= getMaxSupply(), "Maximum supply exceeded");
    _mint(to, amount);
  }

  function burn(uint amount) external {
    _burn(msg.sender, amount);
  }

  //ERC223 WIP
  /*  
  function transfer(address _to, uint _value, bytes memory _data) public returns (bool) {
    if (_value > 0 && _value <= __balanceOf[msg.sender] && isContract(_to)) {
        __balanceOf[msg.sender] -= _value;
        __balanceOf[_to] += _value;
        ERC223ReceivingContract _contract = ERC223ReceivingContract(_to);
            _contract.tokenFallback(msg.sender, _value, _data);
        emit Transfer(msg.sender, _to, _value, _data);
        return true;
    }
    return false;
  }
  */  
}