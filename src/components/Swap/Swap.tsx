import { useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSigner } from '../../hooks';
import { AutomatedMarketMakerService } from '../../services';
import AMM from '../../abis/AMM.json';

export function Swap() {
  const [valueToSwap, setValueToSwap] = useState<number>();
  const [valueToReceive, setValueToReceive] = useState<number>();

  const signer = useSigner();

  const handleSwap = async () => {
    try {
      const balance = await signer?.getBalance();

      const chainId = signer?.provider?.network.chainId.toString();

      if (chainId && balance && valueToSwap && balance.gt(valueToSwap)) {
        const automatedMarketMakerService = AutomatedMarketMakerService.getInstance();
        await automatedMarketMakerService.getAMMContract({
          abi: AMM.abi,
          address: (AMM.networks as Record<string, Record<string, unknown>>)?.[
            chainId
          ].address as string,
        });

        const response = await automatedMarketMakerService.swapFirstToken(
          valueToSwap,
        );

        if (!response) console.log('Could not swap tokens');
      }
    } catch (error) {
      console.error('Swap failed: ', error);
    }
  };

  return (
    <Container maxWidth="sm">
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
          endAdornment: <Typography>ETH</Typography>,
          inputProps: { min: 0 },
        }}
        variant="outlined"
      />
      <Typography style={{ marginTop: 20, marginBottom: 20 }}>For</Typography>
      <TextField
        label="Amount"
        type="number"
        value={valueToReceive}
        placeholder="Amount to receive"
        onChange={(event) => {
          const value = Number(event.target.value);
          if (value) setValueToSwap(value);
        }}
        InputProps={{
          endAdornment: <Typography>DEX</Typography>,
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
