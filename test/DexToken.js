/* eslint-disable no-undef */
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Experiment', () => {
  let token;
  let pool;
  let amm;
  let owner;
  let addr1;
  let priceConsumer;

  beforeEach(async () => {
    try {
      [owner, addr1] = await ethers.getSigners();

      const Token = await ethers.getContractFactory('DexToken');
      token = await Token.deploy();

      const PriceConsumer = await ethers.getContractFactory('PriceConsumer');
      priceConsumer = await PriceConsumer.deploy(token.address);

      const AMM = await ethers.getContractFactory('AutomatedMarketMaker');
      amm = await AMM.deploy(priceConsumer.address);

      const Pool = await ethers.getContractFactory('LiquidityPool');
      pool = await Pool.deploy(token.address, amm.address);

      await token.transfer(pool.address, 99_999_000);

      // small ammount of tokens to test with
      await token.transfer(addr1.address, 1_000);
    } catch (error) {
      console.log(error);
    }
  });

  it('should have name and symbol', async () => {
    console.log('Check: both name and symbol have expected values.');
    expect(await token.name()).to.equal('Dex Token');
    expect(await token.symbol()).to.equal('DEX');
  });

  it('should have all supply', async () => {
    // sending some to addr1 for testing purposes
    expect(await token.balanceOf(addr1.address)).to.equal(1_000);
    expect(await token.balanceOf(pool.address)).to.equal(99_999_000);
  });

  // Temporary commented out, need to figure out a way to mock chainlink data feed
  // it('should deposit', async () => {
  //   const { provider } = waffle;

  //   await token.connect(addr1).approve(pool.address, 100);
  //   await pool.connect(addr1).deposit(100, {
  //     value: ethers.utils.parseEther('100').toString(),
  //   });

  //   expect(
  //     ethers.utils.formatEther(await provider.getBalance(pool.address)),
  //   ).to.equal('99.925');
  //   expect((await token.balanceOf(addr1.address)).toString()).to.equal('901');
  //   expect((await token.balanceOf(pool.address)).toString()).to.equal(
  //     '99999099',
  //   );
  // });

  // it("should deposit & withdraw", async () => {
  //   await token.connect(addr1).approve(pool.address, 100);
  //   await pool.connect(addr1).deposit(100, {
  //     value: ethers.utils.parseEther("100").toString(),
  //   });

  //   await pool.connect(addr1).withdraw(25); // in %!!!

  //   const { provider } = waffle;
  //   expect(
  //     ethers.utils.formatEther(await provider.getBalance(pool.address))
  //   ).to.equal("75.0");
  //   expect((await token.balanceOf(addr1.address)).toString()).to.equal("925");
  //   expect((await token.balanceOf(pool.address)).toString()).to.equal(
  //     "99999075"
  //   );
  // });

  // it("should swap in both directions", async () => {
  //   await token.connect(addr1).approve(pool.address, 100);
  //   await pool.connect(addr1).deposit(100, {
  //     value: ethers.utils.parseEther("100").toString(),
  //   });

  //   await pool.connect(addr1).swapToken1ToToken2({
  //     value: ethers.utils.parseEther("50").toString(),
  //   });

  //   await token.connect(addr1).approve(pool.address, 34);
  //   await pool.connect(addr1).swapToken2ToToken1(34);
  // });
});
