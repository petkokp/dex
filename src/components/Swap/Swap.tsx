import { useState } from 'react';
import {
  Button,
  Container,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSigner } from '../../hooks';
import { AutomatedMarketMakerService } from '../../services';
import AMM from '../../abis/AMM.json';

export function Swap() {
  const [valueToSwap, setValueToSwap] = useState(0);
  const [valueToReceive, setValueToReceive] = useState(0);

  const [tokenToSwap, setTokenToSwap] = useState('ETH');
  const [tokenToReceive, setTokenToReceive] = useState('AAVE');

  const changeTokenToSwap = (event: SelectChangeEvent) => {
    setTokenToSwap(event.target.value as string);
  };

  const changeTokenToReceive = (event: SelectChangeEvent) => {
    setTokenToReceive(event.target.value as string);
  };

  const signer = useSigner();

  const handleSwap = async () => {
    try {
      const balance = await signer?.getBalance();

      const chainId = signer?.provider?.network.chainId.toString();

      if (chainId && balance && balance.gt(valueToSwap)) {
        const automatedMarketMakerService = AutomatedMarketMakerService.getInstance();
        await automatedMarketMakerService.getAMMContract({
          abi: AMM.abi,
          address: (AMM.networks as Record<string, Record<string, unknown>>)
            ?.[chainId].address as string,
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
        onChange={(event) => setValueToSwap(Number(event.target.value))}
        InputProps={{
          endAdornment: (
            <Select value={tokenToSwap} onChange={changeTokenToSwap}>
              <MenuItem value="ETH">ETH</MenuItem>
              <MenuItem value="AAVE">AAVE</MenuItem>
              <MenuItem value="USDT">USDT</MenuItem>
            </Select>
          ),
        }}
        variant="outlined"
      />
      <Typography style={{ marginTop: 20, marginBottom: 20 }}>For</Typography>
      <TextField
        label="Amount"
        type="number"
        value={valueToReceive}
        onChange={(event) => setValueToReceive(Number(event.target.value))}
        InputProps={{
          endAdornment: (
            <Select value={tokenToReceive} onChange={changeTokenToReceive}>
              <MenuItem value="ETH">ETH</MenuItem>
              <MenuItem value="AAVE">AAVE</MenuItem>
              <MenuItem value="USDT">USDT</MenuItem>
            </Select>
          ),
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
