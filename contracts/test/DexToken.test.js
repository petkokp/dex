/* eslint-disable no-undef */

const DexToken = artifacts.require('DexToken');

contract('Dex token', async (accounts) => {
  it('should get max supply', async () => {
    const tokenInstance = await DexToken.deployed();
    const balance = await tokenInstance.getMaxSupply();
    assert.equal(balance.valueOf(), 1000 * 10 ** 18);
  });

  // it('should transfer token', async () => {
  //   const tokenInstance = await DexToken.deployed();

  //   await tokenInstance.transfer(
  //     accounts[1],
  //     5000,
  //     { from: accounts[0] },
  //   );

  //   const firstAccountBalance = await tokenInstance.balanceOf(accounts[0]);

  //   const secondAccountBalance = await tokenInstance.balanceOf(
  //     accounts[1],
  //   );

  //   assert.equal(BigInt(firstAccountBalance), 999999999999999995000n);

  //   assert.equal(BigInt(secondAccountBalance), 5000);
  // });

  it('should burn tokens', async () => {
    const tokenInstance = await DexToken.deployed();

    const balanceBefore = await tokenInstance.getMaxSupply();

    assert.equal(balanceBefore.valueOf(), 1000 * 10 ** 18);

    await tokenInstance.burn(1000);

    const balanceAfter = await tokenInstance.getMaxSupply();

    assert.equal(balanceAfter.valueOf(), (1000 * 10 ** 18) - 1000);
  });

  // it('should mint tokens', async () => {
  //   const tokenInstance = await DexToken.deployed();

  //   await tokenInstance.burn(1000);

  //   await tokenInstance.mint(accounts[2], 1000);

  //   const thirdAccountBalance = await tokenInstance.balanceOf(
  //     accounts[2],
  //   );

  //   assert.equal(BigInt(thirdAccountBalance), 1000);
  // });
});
