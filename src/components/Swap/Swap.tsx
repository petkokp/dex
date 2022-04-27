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
import { useWeb3Provider } from '../../hooks';

export function Swap() {
  const { address, balance, sendTransaction } = useWeb3Provider();

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

  const handleSwap = () => {
    if (balance && balance >= valueToSwap /* calculate gas somewhere */) {
      sendTransaction?.({
        to: address, // address of the contract
        value: valueToSwap,
      });
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
