export interface Currency {
  buy: boolean;
  featured: boolean;
  hasExternalId: boolean;
  image: string;
  isExtraIdSupported: boolean;
  isFiat: boolean;
  isStable: boolean;
  legacyTicker: string;
  name: string;
  network: string;
  sell: boolean;
  supportsFixedRate: boolean;
  ticker: string;
  tokenContract: string;
}

export interface CurrencyOption {
  image: string;
  name: string;
  ticker: string;
  network: string;
}

export interface ExchangeState {
  from: {
    currency: CurrencyOption;
    value: string;
  };
  to: {
    currency: CurrencyOption;
    value: string;
  };
  address: string;
}

export interface MinAmountResponse {
  fromCurrency: string;
  fromNetwork: string;
  toCurrency: string;
  toNetwork: string;
  flow: string;
  minAmount: number;
}

export interface EstimatedAmountResponse {
  fromCurrency: string;
  fromNetwork: string;
  toCurrency: string;
  toNetwork: string;
  flow: string;
  type: string;
  rateId: string;
  validUntil: string;
  transactionSpeedForecast: string | null;
  warningMessage: string | null;
  depositFee: number;
  withdrawalFee: number;
  userId: null;
  fromAmount: number;
  toAmount: number;
}
