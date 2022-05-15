pragma solidity >=0.8.10 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DexToken is ERC20, Ownable {
  string _name = 'Dex Token';
  string _symbol = 'DEX';
  uint256 private supply = 1000 * 10 ** decimals();

  mapping(address => uint) private __balanceOf;
  mapping(address => mapping(address => uint)) __allowances;

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



  function balanceOf(address _addr) public view override returns (uint) {
    return __balanceOf[_addr];
  }
  
  //ERC20
  function transfer(address _to, uint _value) public override returns (bool) {
    if (_value > 0 && _value <= __balanceOf[msg.sender] && !isContract(_to)) {
        __balanceOf[msg.sender] -= _value;
        __balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value); 
        return true;
    }
    return false;
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

  function transferFrom(address _from, address _to, uint _value) public override returns (bool success) {
    if (__allowances[_from][msg.sender] > 0 && _value > 0 &&
        __allowances[_from][msg.sender] >= _value && __balanceOf[_from] >= _value) {
            
        __balanceOf[_from] -= _value;
        __balanceOf[_to] += _value;          
        __allowances[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
    return false;
  }
  
  function approve(address _spender, uint _value) public override returns (bool success) {
    __allowances[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }
  
  function allowance(address _owner, address _spender) public view override returns (uint remaining) {
    return __allowances[_owner][_spender];
  }
  
  function isContract(address _addr) public view returns (bool) {
    uint32 size;
    assembly {
      size := extcodesize(_addr)
    }
    return (size > 0);
  }
  
}