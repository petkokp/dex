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
  let Token, Pool, AMM;
  let token, pool, amm;
  let owner, addr1, addr2;

  beforeEach(async () => {
    Token = await ethers.getContractFactory('DexToken');
    token = await Token.deploy();

    AMM = await ethers.getContractFactory('AutomatedMarketMaker');
    amm = await AMM.deploy();

    Pool = await ethers.getContractFactory('LiquidityPool');
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
    expect(await token.balanceOf(pool.address)).to.equal(99_999_000);
    expect(await token.balanceOf(addr1.address)).to.equal(1_000);
  })


  it('should deposit', async () => {    
    const provider = waffle.provider;

    await token.connect(addr1).approve(pool.address, 100);
    await pool.connect(addr1).deposit(100, {
      value: ethers.utils.parseEther("100").toString()
    });

    expect(ethers.utils.formatEther(await provider.getBalance(pool.address))).to.equal("100.0");
    expect((await token.balanceOf(addr1.address)).toString()).to.equal("900");
    expect((await token.balanceOf(pool.address)).toString()).to.equal("99999100");
  })

  it('should deposit & withdraw', async () => {
    await token.connect(addr1).approve(pool.address, 100);
    await pool.connect(addr1).deposit(100, {
      value: ethers.utils.parseEther("100").toString()
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
      value: ethers.utils.parseEther("100").toString()
    });

    await pool.connect(addr1).swapToken1ToToken2({
      value: ethers.utils.parseEther("50").toString()
    });

    await pool.connect(addr1).swapToken2ToToken1(34);
  })
})


// contract('Dex token', async (accounts) => {
//   let token;
//   let pool;

//   before(async () => {
//     token = await DexToken.new();
//     //pool = await LiquidityPool.new();
//   });

//   it('should get max supply', async () => {
//     const balance = await token.getMaxSupply();
//     assert.equal(balance.valueOf(), 100000); 
//   });

//   it('should transfer token', async () => {
//     console.log('hello ', await token.balanceOf(token.address));
//     console.log('acc1 ', await token.balanceOf(accounts[0]));
//     console.log('acc2 ', await token.balanceOf(accounts[1]));
//     await token.approve(accounts[0], 100);
//     await token.transferFrom(accounts[0], accounts[1], 100);

//     console.log('hello');
//     const firstAccountBalance = await token.balanceOf(accounts[0]);
        
//     const secondAccountBalance = await token.balanceOf(accounts[1]);
//     console.log('hi', secondAccountBalance);
//     console.log('DICKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', firstAccountBalance);
//     assert.equal(firstAccountBalance, 99500);

//     assert.equal(secondAccountBalance, 5000);
//   });

  // it('provide idfk', async() => {
  //     const worked = await pool.deposit(100, 100);
  //     console.log('did it worked');

  //     assert.equal(true, worked)
  // })

  // it('should burn tokens', async () => {
  //   const tokenInstance = await DexToken.deployed();

  //   const balanceBefore = await tokenInstance.getMaxSupply();

  //   assert.equal(balanceBefore.valueOf(), 100000);

  //   await tokenInstance.burn(1000);

//     const balanceAfter = await tokenInstance.getMaxSupply();

//     assert.equal(balanceAfter.valueOf(), (100000) - 1000);
//   });

//   it('should mint tokens', async () => {
//     const tokenInstance = await DexToken.deployed();

//     await tokenInstance.burn(1000);

//     await tokenInstance.mint(accounts[2], 1000);

//     const thirdAccountBalance = await tokenInstance.balanceOf(
//       accounts[2],
//     );

//     assert.equal(BigInt(thirdAccountBalance), 1000);
//   });
// });
