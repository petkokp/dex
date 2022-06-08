pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract DexToken is ERC20, Ownable {
  string _name = 'Dex Token';
  string _symbol = 'DEX';
  uint256 private supply = 100000;

  //mapping(address => uint) private __balanceOf;
  //mapping(address => mapping(address => uint)) __allowances;

  constructor() ERC20(_name, _symbol) {
    _mint(msg.sender, supply);
    //__balanceOf[msg.sender] = supply;
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
  
  // function transfer(address _to, uint256 _value) override public returns (bool success) {
  //       console.log("msg.sender: ", msg.sender);
  //       console.log("balance of msg: ", __balanceOf[msg.sender]);
  //       console.log("address of contract: ", address(this));
  //       console.log("balance of ctr: ", __balanceOf[address(this)]);
  //       require(__balanceOf[msg.sender] >= _value);
  //       __balanceOf[msg.sender] -= _value;
  //       __balanceOf[_to] += _value;
  //       emit Transfer(msg.sender, _to, _value);
  //       return true;
  //   }

  //   function approve(address _spender, uint256 _value) override public returns (bool success) {
  //       __allowances[msg.sender][_spender] = _value;
  //       emit Approval(msg.sender, _spender, _value);
  //       return true;
  //   }

  //   function transferFrom(address _from, address _to, uint256 _value) override public returns (bool success) {
  //       require(_value <= __balanceOf[_from]);
  //       require(_value <= __allowances[_from][msg.sender]);
  //       __balanceOf[_from] -= _value;
  //       __balanceOf[_to] += _value;
  //       __allowances[_from][msg.sender] -= _value;
  //       emit Transfer(_from, _to, _value);
  //       return true;
  //   }
}