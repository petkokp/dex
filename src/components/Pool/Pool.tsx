import { useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { utils } from 'ethers';
import { useSigner } from '../../hooks';
import { Tokens } from '../tokens';
import { DexTokenService, LiquidityPoolService } from '../../services';
import LP from '../../abis/contracts/LiquidityPool.sol/LiquidityPool.json';
import DT from '../../abis/contracts/DexToken.sol/DexToken.json';

export function Pool() {
  const [ethValue, setEthValue] = useState(0);
  const [dexValue, setDexValue] = useState(0);
  const [percentageToWithdraw, setPercentageToWithdraw] = useState(0);

  const signer = useSigner();

  const handleAddingLiquidity = async () => {
    try {
      const balance = await signer?.getBalance();

      const chainId = signer?.provider?.network.chainId.toString();
console.log(chainId);
      const canAddLiquidity = chainId && balance;

      if (canAddLiquidity) {
        const contract = await LiquidityPoolService.getInstance().getLiquidityPoolContract({
          abi: LP.abi,
          address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
        });
        const token = await DexTokenService.getInstance().getTokenContract({
          abi: DT.abi,
          address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        });
        debugger;
        // to do - add dexValue
        const resp = await token?.approve("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", dexValue);
        const response = await contract?.deposit(dexValue, {
          value: utils.parseEther(ethValue.toString()),
          gasLimit: 600000,
        });

        await response.wait();
      }
    } catch (error) {
      console.error('Adding liquidity failed: ', error);
    }
  };

  const handleWithdrawingLiquidity = async () => {
    try {
      const balance = await signer?.getBalance();

      const chainId = signer?.provider?.network.chainId.toString();

      const canAddLiquidity = chainId && percentageToWithdraw;

      if (canAddLiquidity) {
        const contract = await LiquidityPoolService.getInstance().getLiquidityPoolContract({
          abi: LP.abi,
          address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
        });

        const response = await contract?.withdraw(percentageToWithdraw, {
          gasLimit: 600000,
        });

        await response.wait();
      }
    } catch (error) {
      console.error('Withdrawing liquidity failed: ', error);
    }
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column' }} maxWidth="sm">
      <IconButton onClick={() => history.back()}>
        <ArrowBackIcon />
      </IconButton>
      <Typography style={{ marginTop: 20, marginBottom: 20 }}>
        Add liquidity
      </Typography>
      <Typography style={{ marginTop: 20, marginBottom: 20 }}>
        Select ETH value
      </Typography>
      <TextField
        label="Amount"
        type="number"
        value={ethValue}
        onChange={(event) => {
          const value = Number(event.target.value);
          if (value) setEthValue(value);
        }}
        InputProps={{
          endAdornment: <Typography>{Tokens.ETH}</Typography>,
          inputProps: { min: 0 },
        }}
        variant="outlined"
      />
      <Typography style={{ marginTop: 20, marginBottom: 20 }}>
        Select DEX value
      </Typography>
      <TextField
        label="Amount"
        type="number"
        value={dexValue}
        onChange={(event) => {
          const value = Number(event.target.value);
          if (value) setDexValue(value);
        }}
        InputProps={{
          endAdornment: <Typography>{Tokens.DEX}</Typography>,
          inputProps: { min: 0 },
        }}
        variant="outlined"
      />
      <Button
        variant="contained"
        style={{ marginTop: 20 }}
        onClick={handleAddingLiquidity}
      >
        Add Liquidity
      </Button>
      <Divider />
      <Typography style={{ marginTop: 20, marginBottom: 20 }}>
        Withdraw liquidity
      </Typography>
      <Typography style={{ marginTop: 20, marginBottom: 20 }}>
        Select % to withdraw
      </Typography>
      <TextField
        label="Percentage"
        type="number"
        value={percentageToWithdraw}
        onChange={(event) => {
          const value = Number(event.target.value);
          if (value) setPercentageToWithdraw(value);
        }}
        InputProps={{
          endAdornment: <Typography>%</Typography>,
          inputProps: { min: 0, max: 100 },
        }}
        variant="outlined"
      />
      <Button
        variant="contained"
        style={{ marginTop: 20 }}
        onClick={handleWithdrawingLiquidity}
      >
        Withdraw Liquidity
      </Button>
    </Container>
  );
}

export default Pool;
