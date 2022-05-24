import { Contract, utils } from 'ethers';
import { SignerService } from '../../signer';
import { ContractMetadata } from '../contract.interface';

export interface ILiquidityPoolService {
  getLiquidityPoolContract: (contractMetadata: ContractMetadata) => Promise<Contract | undefined>;
  deposit: (firstAmount: number, secondAmount: number) => Promise<boolean | undefined>;
  withdraw: (amount: string) => Promise<boolean | undefined>;
  transfer(recipient: string, amount: number): Promise<boolean | undefined>;
  transferFrom(sender: string, recipient: string, amount: number): Promise<boolean | undefined>;
}

export class LiquidityPoolService implements ILiquidityPoolService {
  private static instance: LiquidityPoolService;

  contract: Contract | undefined;

  static getInstance(): LiquidityPoolService {
    if (!LiquidityPoolService.instance) {
      LiquidityPoolService.instance = new LiquidityPoolService();
    }

    return LiquidityPoolService.instance;
  }

  async getLiquidityPoolContract({ abi, address }: ContractMetadata) {
    try {
      const signerService = SignerService.getInstance();
      const signer = await signerService.getSigner();

      this.contract = signer ? new Contract(address, abi, signer) : undefined;

      return this.contract;
    } catch (error) {
      console.error('Could not get liquidity pool contract: ', error);
      return undefined;
    }
  }

  async deposit(firstAmount: number, secondAmount: number) {
    try {
      const response: boolean = await this.contract?.deposit(firstAmount, secondAmount);

      if (!response) console.log('Could not deposit liquidity');

      return response;
    } catch (error) {
      console.error('Error while trying to deposit liquidity: ', error);
      return undefined;
    }
  }

  async withdraw(amount: string) {
    try {
      const response: boolean = await this.contract?.withdraw(amount);

      if (!response) console.log('Could not withdraw liquidity');

      return response;
    } catch (error) {
      console.error('Error while trying to withdraw liquidity: ', error);
      return undefined;
    }
  }

  async transfer(recipient: string, amount: number) {
    try {
      const response: boolean = await this.contract?.transfer(recipient, amount);

      if (!response) console.log('Could not transfer liquidity');

      return response;
    } catch (error) {
      console.error('Could not transfer liquidity: ', error);
      return undefined;
    }
  }

  async transferFrom(sender: string, recipient: string, amount: number) {
    try {
      const response: boolean = await this.contract?.transferFrom(sender, recipient, amount);

      if (!response) console.log('Could not transfer liquidity from: ', sender);

      return response;
    } catch (error) {
      console.error('Could not transfer liquidity: ', error);
      return undefined;
    }
  }
}

export default LiquidityPoolService;
