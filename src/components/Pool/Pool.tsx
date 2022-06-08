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

export function Pool() {
  const [firstToken, setFirstToken] = useState('ETH');
  const [secondToken, setSecondToken] = useState('AAVE');

  const [firstTokenValue, setFirstTokenValue] = useState(0);
  const [secondTokenValue, setSecondTokenValue] = useState(0);

  const changeFirstToken = (event: SelectChangeEvent) => {
    setFirstToken(event.target.value as string);
  };

  const changeSecondToken = (event: SelectChangeEvent) => {
    setSecondToken(event.target.value as string);
  };

  const signer = useSigner();

  const handleAddingLiquidity = () => {
    const balance = signer?.getBalance();
    if (balance && +balance >= firstTokenValue /* calculate gas somewhere */) {
      signer?.sendTransaction?.({
        to: '', // address of the contract
        value: firstTokenValue,
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <IconButton onClick={() => history.back()}>
        <ArrowBackIcon />
      </IconButton>
      <Typography style={{ marginTop: 20, marginBottom: 20 }}>
        Add liquidity
      </Typography>
      <Typography style={{ marginTop: 20, marginBottom: 20 }}>
        Select first token
      </Typography>
      <TextField
        label="Amount"
        type="number"
        value={firstTokenValue}
        onChange={(event) => setFirstTokenValue(Number(event.target.value))}
        InputProps={{
          endAdornment: (
            <Select value={firstToken} onChange={changeFirstToken}>
              <MenuItem value="ETH">ETH</MenuItem>
              <MenuItem value="AAVE">AAVE</MenuItem>
              <MenuItem value="USDT">USDT</MenuItem>
            </Select>
          ),
        }}
        variant="outlined"
      />
      <Typography style={{ marginTop: 20, marginBottom: 20 }}>
        Select second token
      </Typography>
      <TextField
        label="Amount"
        type="number"
        value={secondTokenValue}
        onChange={(event) => setSecondTokenValue(Number(event.target.value))}
        InputProps={{
          endAdornment: (
            <Select value={secondToken} onChange={changeSecondToken}>
              <MenuItem value="ETH">ETH</MenuItem>
              <MenuItem value="AAVE">AAVE</MenuItem>
              <MenuItem value="USDT">USDT</MenuItem>
            </Select>
          ),
        }}
        variant="outlined"
      />
      <Button variant="contained" style={{ marginTop: 20 }} onClick={handleAddingLiquidity}>
        Add Liquidity
      </Button>
    </Container>
  );
}

export default Pool;
