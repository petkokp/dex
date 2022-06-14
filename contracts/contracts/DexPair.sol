pragma solidity >=0.8.10 <0.9.0;

import "./DexToken.sol";

contract DexPair {
    uint256 private reserve0;
    uint256 private reserve1;

    event Mint(address indexed sender, uint amount0, uint amount1);
    event Sync(uint112 reserve0, uint112 reserve1);

    function mint(address to, uint256 totalSupply, uint256 balanceDexToken, uint256 balanceEth) external lock returns (uint liquidity) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        uint amount0 = balanceDexToken.sub(_reserve0);
        uint amount1 = balanceEth.sub(_reserve1);

        liquidity = Math.min(amount0.mul(totalSupply) / _reserve0, amount1.mul(totalSupply) / _reserve1);
        require(liquidity > 0, 'INSUFFICIENT_LIQUIDITY_MINTED');
        _mint(to, liquidity);

        _update(balanceDexToken, balanceEth, _reserve0, _reserve1);
        emit Mint(msg.sender, amount0, amount1);
    }

    function _update(uint256 balanceDexToken, uint256 balanceEth, uint256 _reserve0, uint256 _reserve1) private {
        require(balanceDexToken <= uint112(-1) && balanceEth <= uint112(-1), 'Pancake: OVERFLOW');
        reserve0 = uint112(balanceDexToken);
        reserve1 = uint112(balanceEth);
        emit Sync(balanceDexToken, balanceEth);
    }

    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
    }
}
