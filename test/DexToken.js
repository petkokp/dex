/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable spaced-comment */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

//const DexToken = artifacts.require('DexToken');
//const LiquidityPool = artifacts.require('LiquidityPool');

const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Experiment', () => {
  let token, pool, amm;
  let owner, addr1, addr2;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('DexToken');
    token = await Token.deploy();

    const AMM = await ethers.getContractFactory('AutomatedMarketMaker');
    amm = await AMM.deploy();

    const Pool = await ethers.getContractFactory('LiquidityPool');
    pool = await Pool.deploy(token.address, amm.address);

    await token.transfer(pool.address, 99_999_000);

    [owner, addr1, addr2] = await ethers.getSigners();
    //small ammount of tokens to test with
    await token.transfer(addr1.address, 1_000);
  })

  it('should have name and symbol', async () => {
    console.log("Check: both name and symbol have expected values.")
    expect(await token.name()).to.equal("Dex Token")
    expect(await token.symbol()).to.equal("DEX");
  })

  it('should have all supply', async () => {
    //sending some to addr1 for testing purposes
    expect(await token.balanceOf(addr1.address)).to.equal(1_000);
    expect(await token.balanceOf(pool.address)).to.equal(99_999_000);    
  })


  it('should deposit', async () => {    
    const provider = waffle.provider;

    await token.connect(addr1).approve(pool.address, 100);
    await pool.connect(addr1).deposit(100, {
      value: ethers.utils.parseEther("100").toString(),
    });

    expect(ethers.utils.formatEther(await provider.getBalance(pool.address))).to.equal("100.0");
    expect((await token.balanceOf(addr1.address)).toString()).to.equal("900");
    expect((await token.balanceOf(pool.address)).toString()).to.equal("99999100");
  })

  it('should deposit & withdraw', async () => {
    await token.connect(addr1).approve(pool.address, 100);
    await pool.connect(addr1).deposit(100, {
      value: ethers.utils.parseEther("100").toString(),
    });
    
    await pool.connect(addr1).withdraw(25); //in %!!!

    const provider = waffle.provider;
    expect(ethers.utils.formatEther(await provider.getBalance(pool.address))).to.equal("75.0");
    expect((await token.balanceOf(addr1.address)).toString()).to.equal("925");
    expect((await token.balanceOf(pool.address)).toString()).to.equal("99999075");
  })

  it('should swap in both directions', async () => {
    await token.connect(addr1).approve(pool.address, 100);
    await pool.connect(addr1).deposit(100, {
      value: ethers.utils.parseEther("100").toString(),
    });

    await pool.connect(addr1).swapToken1ToToken2({
      value: ethers.utils.parseEther("50").toString(),
    });

    await token.connect(addr1).approve(pool.address, 34);
    await pool.connect(addr1).swapToken2ToToken1(34);
  })
})
