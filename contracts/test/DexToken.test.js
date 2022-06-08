/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

const DexToken = artifacts.require('DexToken');
const AutomatedMarketMaker = artifacts.require('AutomatedMarketMaker');
const LiquidityPool = artifacts.require('LiquidityPool');

const Web3 = require('web3');

contract('Dex token', async (accounts) => {
  it('should get max supply', async () => {
    const tokenInstance = await DexToken.new();
    const balance = await tokenInstance.getMaxSupply();
    assert.equal(balance.valueOf(), 1000 * 10 ** 18);
  });

  it('should transfer token', async () => {
    const tokenInstance = await DexToken.new();

     await tokenInstance.transfer(
       accounts[1],
       5000,
       { from: accounts[0] },
     );

     const firstAccountBalance = await tokenInstance.balanceOf(accounts[0]);

     const secondAccountBalance = await tokenInstance.balanceOf(
       accounts[1],
     );

     assert.equal(BigInt(firstAccountBalance), 999999999999999995000n);

     assert.equal(BigInt(secondAccountBalance), 5000);
  });

  it('should burn tokens', async () => {
    const tokenInstance = await DexToken.new();

    const balanceBefore = await tokenInstance.getMaxSupply();

    assert.equal(balanceBefore.valueOf(), 1000 * 10 ** 18);

    await tokenInstance.burn(1000);

    const balanceAfter = await tokenInstance.getMaxSupply();

    assert.equal(balanceAfter.valueOf(), (1000 * 10 ** 18) - 1000);
  });

  it('should mint tokens', async () => {
    const tokenInstance = await DexToken.new();

     await tokenInstance.burn(1000);

     await tokenInstance.mint(accounts[2], 1000);

     const thirdAccountBalance = await tokenInstance.balanceOf(
       accounts[2],
     );

    assert.equal(BigInt(thirdAccountBalance), 1000);
  });

  it('should deposit', async () => {
    const token = await DexToken.new();
    const amm = await AutomatedMarketMaker.new();
    const pool = await LiquidityPool.new(token.address, amm.address);

    await token.transfer(
      pool.address,
      1000,
      { from: accounts[0] },
    );

    //send some to acc1 for testing
    await token.transfer(
      accounts[1],
      100,
      { from: accounts[0] },
    );
    
    await token.approve(pool.address, 5);
    await pool.deposit(5, {
      value: Web3.utils.toWei('5', 'Ether').toString()
    });

    await pool.withdraw(20);

    await pool.swapToken1ToToken2({
      value: Web3.utils.toWei('0.1', 'Ether').toString()
    })

    await token.approve(pool.address, 1);
    await pool.swapToken2ToToken1(1);
  })

  it('should withdraw', async () => {

  })

  it('should swap', async () => {

  })
});
