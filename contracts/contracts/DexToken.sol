pragma solidity >=0.8.10 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DexToken is ERC20, Ownable {
  string _name = 'Dex Token';
  string _symbol = 'DEX';
  uint256 private supply = 1000 * 10 ** decimals();

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
  
}