import { Contract } from 'ethers';
import { SignerService } from '../../signer';
import { ContractMetadata } from '../contract.interface';

export interface AutomatedMarketMakerActions {
  getMyHoldings(): Promise<Record<string, Record<string, string>> | undefined>;
  provide(
    firstTokenAmount: number,
    secondTokenAmount: number,
    poolTotalDeposits: number,
  ): Promise<boolean>;
  getEquivalentFirstTokenEstimate(secondTokenAmount: number): Promise<boolean>;
  getEquivalentSecondTokenEstimate(firstTokenAmount: number): Promise<boolean>;
  getWithdrawEstimate(share: number, poolTotalDeposits: number): Promise<boolean>;
  withdraw(share: number, poolTotalDeposits: number): Promise<boolean>;
  getFirstSwapTokenEstimate(firstTokenAmount: number): Promise<boolean>;
  getFirstSwapTokenEstimateGivenSecondToken(): Promise<boolean>;
  swapFirstToken(firstTokenAmount: number): Promise<boolean>;
}

export interface IAutomatedMarketMakerService extends AutomatedMarketMakerActions {
  getAMMContract: (
    contractMetadata: ContractMetadata
  ) => Promise<Contract | undefined>;
}

export class AutomatedMarketMakerService
implements IAutomatedMarketMakerService {
  private static instance: AutomatedMarketMakerService;

  contract: Contract | undefined;

  static getInstance(): AutomatedMarketMakerService {
    if (!AutomatedMarketMakerService.instance) {
      AutomatedMarketMakerService.instance = new AutomatedMarketMakerService();
    }

    return AutomatedMarketMakerService.instance;
  }

  async getAMMContract({ abi, address }: ContractMetadata) {
    try {
      const signerService = SignerService.getInstance();
      const signer = await signerService.getSigner();

      this.contract = signer ? new Contract(address, abi, signer) : undefined;

      return this.contract;
    } catch (error) {
      console.error('Could not get automated market maker contract: ', error);
      return undefined;
    }
  }

  async getMyHoldings() {
    try {
      const response = await this.contract?.getMyHoldings();

      return response;
    } catch (error) {
      console.error('Error while trying to get holdings: ', error);

      return undefined;
    }
  }

  async provide(
    firstTokenAmount: number,
    secondTokenAmount: number,
    poolTotalDeposits: number,
  ) {
    try {
      const response = await this.contract?.provide(
        firstTokenAmount,
        secondTokenAmount,
        poolTotalDeposits,
      );

      console.log('AMM - provide: ', response);

      return true;
    } catch (error) {
      console.error('Error while trying to provider liquidity: ', error);
      return false;
    }
  }

  async getEquivalentFirstTokenEstimate(secondTokenAmount: number) {
    try {
      const response = await this.contract?.getEquivalentToken1Estimate(
        secondTokenAmount,
      );

      console.log('AMM - getEquivalentFirstTokenEstimate: ', response);

      return true;
    } catch (error) {
      console.error('Could not get equivalent first toekn estimate: ', error);
      return false;
    }
  }

  async getEquivalentSecondTokenEstimate(firstTokenAmount: number) {
    try {
      const response = await this.contract?.getEquivalentToken2Estimate(
        firstTokenAmount,
      );

      console.log('AMM - getEquivalentSecondTokenEstimate: ', response);

      return true;
    } catch (error) {
      console.error('Could not get equivalent second token estimate: ', error);
      return false;
    }
  }

  async getWithdrawEstimate(share: number, poolTotalDeposits: number) {
    try {
      const response = await this.contract?.getWithdrawEstimate(share, poolTotalDeposits);

      console.log('AMM - getWithdrawEstimate: ', response);

      return true;
    } catch (error) {
      console.error('Could not get withdraw estimate: ', error);
      return false;
    }
  }

  async withdraw(share: number, poolTotalDeposits: number) {
    try {
      const response = await this.contract?.withdraw(share, poolTotalDeposits);

      console.log('AMM - withdraw: ', response);

      return true;
    } catch (error) {
      console.error('Could not withdraw: ', error);
      return false;
    }
  }

  async getFirstSwapTokenEstimate(firstTokenAmount: number) {
    try {
      const response = await this.contract?.getSwapToken1Estimate(
        firstTokenAmount,
      );

      console.log('AMM - getFirstSwapTokenEstimate: ', response);

      return true;
    } catch (error) {
      console.error('Could not get first swap token estimate: ', error);
      return false;
    }
  }

  async getFirstSwapTokenEstimateGivenSecondToken() {
    try {
      const response = await this.contract?.getSwapToken1EstimateGivenToken2();

      console.log('AMM - getFirstSwapTokenEstimateGivenSecondToken: ', response);

      return true;
    } catch (error) {
      console.error('Could not get first swap token estimate given second token: ', error);
      return false;
    }
  }

  async swapFirstToken(firstTokenAmount: number) {
    try {
      const response = await this.contract?.swapToken1(firstTokenAmount);

      console.log('AMM - swapFirstToken: ', response);

      return true;
    } catch (error) {
      console.error('Could not swap first token: ', error);
      return false;
    }
  }
}

export default AutomatedMarketMakerService;
