import { useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { utils } from 'ethers';
import { useSigner } from '../../hooks';
import LP from '../../abis/contracts/LiquidityPool.sol/LiquidityPool.json';
import { LiquidityPoolService } from '../../services';
import { Tokens } from '../tokens';

export function Swap() {
  const [tokenToSwap, setTokenToSwap] = useState(Tokens.ETH);
  const [valueToSwap, setValueToSwap] = useState<number>();
  const [valueToReceive, setValueToReceive] = useState<number>();

  const signer = useSigner();

  const handleSwap = async () => {
    try {
      const balance = await signer?.getBalance();

      const chainId = signer?.provider?.network.chainId.toString();

      if (chainId && balance && valueToSwap && balance.gt(valueToSwap)) {
        const contract = await LiquidityPoolService.getInstance().getLiquidityPoolContract({
          abi: LP.abi,
          address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
        });

        const response = tokenToSwap === Tokens.ETH
          ? await contract?.swapToken1ToToken2({
            value: utils.parseEther(valueToSwap.toString()),
            gasLimit: 40000,
          })
          : await contract?.swapToken2ToToken1(valueToSwap, {
            gasLimit: 40000,
          });

        await response.wait();

        console.log('response: ', response);
      }
    } catch (error) {
      console.error('Swap failed: ', error);
    }
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column' }} maxWidth="sm">
      <IconButton onClick={() => history.back()}>
        <ArrowBackIcon />
      </IconButton>
      <Typography style={{ marginTop: 20, marginBottom: 20 }}>Swap</Typography>
      <TextField
        label="Amount"
        type="number"
        value={valueToSwap}
        placeholder="Amount to swap"
        onChange={(event) => {
          const value = Number(event.target.value);
          if (value) setValueToSwap(value);
        }}
        InputProps={{
          endAdornment: <Typography>{tokenToSwap}</Typography>,
          inputProps: { min: 0 },
        }}
        variant="outlined"
      />
      <IconButton
        style={{ marginTop: 20 }}
        onClick={() => setTokenToSwap(tokenToSwap === Tokens.DEX ? Tokens.ETH : Tokens.DEX)}
      >
        <SwapVertIcon />
      </IconButton>
      <Typography style={{ marginTop: 20, marginBottom: 20 }}>For</Typography>
      <TextField
        label="Amount"
        type="number"
        value={valueToReceive}
        placeholder="Amount to receive"
        onChange={(event) => {
          const value = Number(event.target.value);
          if (value) setValueToReceive(value);
        }}
        InputProps={{
          endAdornment: (
            <Typography>
              {tokenToSwap === Tokens.DEX ? Tokens.ETH : Tokens.DEX}
            </Typography>
          ),
          inputProps: { min: 0 },
        }}
        variant="outlined"
      />
      <Button
        variant="contained"
        style={{ marginTop: 20 }}
        onClick={handleSwap}
      >
        Swap
      </Button>
    </Container>
  );
}

export default Swap;
