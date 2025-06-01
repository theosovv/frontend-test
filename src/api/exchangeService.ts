import { Currency, EstimatedAmountResponse, MinAmountResponse } from '@src/types/currency';
import { ApiClient } from './client';

export class ExchangeService {
  constructor(private readonly apiClient: ApiClient) {}

  async getCurrencies(): Promise<Currency[]> {
    try {
      const data = await this.apiClient.get<Currency[]>('/exchange/currencies?active=&flow=standard&buy=&sell=');
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch currencies: ${error}`);
    }
  }

  async getMinAmount(
    fromCurrency: string,
    toCurrency: string,
    fromNetwork: string,
    toNetwork: string,
  ): Promise<number> {
    try {
      const { minAmount } = await this.apiClient.get<MinAmountResponse>(
        `/exchange/min-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}`,
      );
      return minAmount;
    } catch (error) {
      throw new Error(`Failed to fetch min amount: ${error}`);
    }
  }

  async getEstimatedAmount(
    fromCurrency: string,
    toCurrency: string,
    fromNetwork: string,
    toNetwork: string,
    fromAmount: number,
  ): Promise<number> {
    try {
      const { toAmount } = await this.apiClient.get<EstimatedAmountResponse>(
        // eslint-disable-next-line max-len
        `/exchange/estimated-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromAmount=${fromAmount}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}`,
      );
      return toAmount;
    } catch (error) {
      throw new Error(`Failed to fetch estimated amount: ${error}`);
    }
  }
}
