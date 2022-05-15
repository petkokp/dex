import { providers } from 'ethers';
import { ISignerService } from './signer.interface';

export class SignerService implements ISignerService {
  private static instance: SignerService;

  signer: providers.JsonRpcSigner | null = null;

  static getInstance(): SignerService {
    if (!SignerService.instance) {
      SignerService.instance = new SignerService();
    }

    return SignerService.instance;
  }

  async getSigner() {
    await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

    const web3Provider = new providers.Web3Provider((window as any).ethereum);

    await web3Provider.send('eth_requestAccounts', []);

    this.signer = web3Provider.getSigner();

    return this.signer;
  }
}

export default SignerService;
