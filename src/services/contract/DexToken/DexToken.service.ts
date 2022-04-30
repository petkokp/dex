import { Contract, utils } from 'ethers';
import { SignerService } from '../../signer';
import { ContractMetadata } from '../contract.interface';

export interface IDexTokenService {
  getTokenContract: (contractMetadata: ContractMetadata) => Promise<Contract | undefined>;
  getMaxSupply: () => Promise<string | undefined>;
  mint: (to: string, amount: string) => Promise<void>;
  burn: (amount: string) => Promise<void>;
}

export class DexTokenService implements IDexTokenService {
  private static instance: DexTokenService;

  contract: Contract | undefined;

  static getInstance(): DexTokenService {
    if (!DexTokenService.instance) {
      DexTokenService.instance = new DexTokenService();
    }

    return DexTokenService.instance;
  }

  async getTokenContract({ abi, address }: ContractMetadata) {
    try {
      const signerService = SignerService.getInstance();
      const signer = await signerService.getSigner();

      this.contract = new Contract(address, abi, signer);

      return this.contract;
    } catch (error) {
      console.error('Could not get token contract: ', error);
      return undefined;
    }
  }

  async getMaxSupply() {
    try {
      const maxSupply = await this.contract?.getMaxSupply();

      return maxSupply ? utils.formatEther(maxSupply) : '';
    } catch (error) {
      console.error('Could not get max supply: ', error);
      return undefined;
    }
  }

  async mint(to: string, amount: string) {
    try {
      await this.contract?.mint(to, amount);
    } catch (error) {
      console.error('Could not mint token: ', error);
    }
  }

  async burn(amount: string) {
    try {
      await this.contract?.burn(amount);
    } catch (error) {
      console.error('Could not burn token: ', error);
    }
  }
}

export default DexTokenService;
