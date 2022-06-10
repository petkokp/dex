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
import { useSigner } from '../../hooks';
import { Tokens } from '../tokens';
import { LiquidityPoolService } from '../../services';
import LP from '../../abis/LiquidityPool.json';

export function Pool() {
  const [ethValue, setEthValue] = useState(0);
  const [dexValue, setDexValue] = useState(0);
  const [percentageToWithdraw, setPercentageToWithdraw] = useState(0);

  const signer = useSigner();

  const handleAddingLiquidity = async () => {
    try {
      const balance = await signer?.getBalance();

      const chainId = signer?.provider?.network.chainId.toString();

      // eth or dex value?
      const canAddLiquidity = chainId && balance && ethValue && balance.gt(ethValue);

      if (canAddLiquidity) {
        const contract = await LiquidityPoolService.getInstance().getLiquidityPoolContract({
          abi: LP.abi,
          address: (LP.networks as Record<string, Record<string, unknown>>)?.[
            chainId
          ].address as string,
        });

        const response = await contract?.deposit(ethValue, {
          gasLimit: 40000,
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
          address: (LP.networks as Record<string, Record<string, unknown>>)?.[
            chainId
          ].address as string,
        });

        const response = await contract?.withdraw(percentageToWithdraw, {
          gasLimit: 40000,
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
