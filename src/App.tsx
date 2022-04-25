import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar, Tabs, Tab, Container,
} from '@mui/material';
import {
  getRoot, getSwap, getPool, getContacts,
} from './routes/paths';

export default function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab component={Link} label="Home" to={getRoot()} />
          <Tab component={Link} label="Swap" to={getSwap()} />
          <Tab component={Link} label="Pool" to={getPool()} />
          <Tab component={Link} label="Contacts" to={getContacts()} />
        </Tabs>
      </AppBar>
      <Container maxWidth="sm">
        <div>
          <h1>Decentralized exchange</h1>
          <ul>
            <li>
              You can
              {' '}
              <a href={getSwap()}>swap</a>
              {' '}
              tokens
            </li>
            <li>
              You can provide
              {' '}
              <a href={getPool()}>liquidity</a>
            </li>
            <li>
              View
              {' '}
              <a href={getContacts()}>contacts</a>
            </li>
          </ul>
        </div>
      </Container>
    </>
  );
}
