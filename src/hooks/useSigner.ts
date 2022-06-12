import { providers } from 'ethers';
import { useEffect, useState } from 'react';
import { SignerService } from '../services';

export const useSigner = () => {
  const [signer, setSigner] = useState<providers.JsonRpcSigner>();

  useEffect(() => {
    async function load() {
      try {
        const signerService = SignerService.getInstance();

        const rpcSigner = await signerService.getSigner();

        setSigner(rpcSigner);
      } catch (error) {
        console.error('Could not load signer: ', error);
      }
    }
    load();
  }, []);

  return signer;
};

export default useSigner;
