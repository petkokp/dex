import { useEffect, useState } from 'react';
import Web3 from 'web3';

function App() {
  const [account, setAccount] = useState<string>(); // state variable to set account.

  useEffect(() => {
    async function load() {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.requestAccounts();

      setAccount(accounts[0]);
    }

    load();
  }, []);

  return (
    <div>
      Your account is:
      {' '}
      {account}
    </div>
  );
}

export default App;
