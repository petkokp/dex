import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar, Tabs, Tab, Container,
} from '@mui/material';
import {
  getRoot, getSwap, getPool, getContacts,
} from './routes/paths';

enum TabValues {
  HOME = 0,
  SWAP = 1,
  POOL = 2,
  CONTACTS = 3,
}

export default function App() {
  const [tabValue, setTabValue] = React.useState(TabValues.HOME);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
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
