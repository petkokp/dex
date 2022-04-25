/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { providers } from 'ethers';
import { useEffect, useState } from 'react';

interface Provider {
  address: string;
  balance: number;
  sendTransaction: (transaction: providers.TransactionRequest) => Promise<providers.TransactionResponse>;
}

export const useWeb3Provider = () => {
  const [provider, setProvider] = useState<Provider>();

  useEffect(() => {
    async function load() {
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

      const web3Provider = new providers.Web3Provider(
        (window as any).ethereum,
        'kovan',
      );

      await web3Provider.send('eth_requestAccounts', []);
      const signer = web3Provider.getSigner();

      setProvider({
        address: await signer.getAddress(),
        balance: (await signer.getBalance()).toNumber(),
        sendTransaction: signer.sendTransaction,
      });
    }
    load();
  }, []);

  return { ...provider };
};

export default useWeb3Provider;
