import { Container, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function Contacts() {
  return (
    <Container maxWidth="sm">
      <IconButton onClick={() => history.back()}>
        <ArrowBackIcon />
      </IconButton>
      <Typography style={{ marginTop: 20, marginBottom: 20 }}>
        Contacts:
      </Typography>
      <a target="_blank" href="https://github.com/petkokp/dex" rel="noreferrer">
        https://github.com/petkokp/dex
      </a>
    </Container>
  );
}

export default Contacts;
