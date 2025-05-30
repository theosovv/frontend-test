import { useCallback, useEffect, useState } from 'react';
import { useApiClient } from '@src/context/api-client';
import {
  Currency,
  CurrencyOption,
  EstimatedAmountResponse,
  ExchangeState,
  MinAmountResponse,
} from '@src/types/currency';

const initState: ExchangeState = {
  from: {
    currency: {
      name: '',
      ticker: '',
      image: '',
      network: '',
    },
    value: '',
  },
  to: {
    currency: {
      name: '',
      ticker: '',
      image: '',
      network: '',
    },
    value: '',
  },
  address: '',
};

export function useExchange() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exchangeState, setExchangeState] = useState<ExchangeState>(initState);
  const apiClient = useApiClient();

  const currenciesOptions = currencies.map((currency) => ({
    name: currency.name,
    ticker: currency.ticker,
    image: currency.image,
    network: currency.network,
  }));

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiClient.get<Currency[]>('/exchange/currencies?active=&flow=standard&buy=&sell=');

        setCurrencies(data);

        const fromCurrency = data[0].ticker;
        const toCurrency = data[1].ticker;
        const fromNetwork = data[0].network;
        const toNetwork = data[1].network;

        const { minAmount } = await apiClient.get<MinAmountResponse>(
          `/exchange/min-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}`,
        );

        const { toAmount } = await apiClient.get<EstimatedAmountResponse>(
          // eslint-disable-next-line max-len
          `/exchange/estimated-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromAmount=${minAmount}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}`,
        );

        setExchangeState({
          from: {
            currency: data[0],
            value: minAmount.toString(),
          },
          to: {
            currency: data[1],
            value: toAmount.toString(),
          },
          address: '',
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch currencies');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, [apiClient]);

  const setCurrency = useCallback(
    async (side: 'from' | 'to', currency: CurrencyOption) => {
      try {
        setError(null);

        const fromCurrency = side === 'from' ? currency : exchangeState.from.currency;
        const toCurrency = side === 'to' ? currency : exchangeState.to.currency;
        const fromNetwork = side === 'from' ? currency.network : exchangeState.from.currency.network;
        const toNetwork = side === 'to' ? currency.network : exchangeState.to.currency.network;

        const { minAmount } = await apiClient.get<MinAmountResponse>(
          `/exchange/min-amount?fromCurrency=${fromCurrency.ticker}&toCurrency=${toCurrency.ticker}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}`,
        );

        const { toAmount } = await apiClient.get<EstimatedAmountResponse>(
          // eslint-disable-next-line max-len
          `/exchange/estimated-amount?fromCurrency=${fromCurrency.ticker}&toCurrency=${toCurrency.ticker}&fromAmount=${minAmount}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}`,
        );

        if (minAmount === null || toAmount === null) {
          setError('This pair is disabled now.');
          return;
        }

        setExchangeState({
          from: {
            currency: fromCurrency,
            value: minAmount.toString(),
          },
          to: {
            currency: toCurrency,
            value: toAmount.toString(),
          },
          address: '',
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch currencies');
      }
    },
    [apiClient, exchangeState.from.currency, exchangeState.to.currency],
  );

  const setFromValue = useCallback(
    async (value: string) => {
      try {
        setError(null);

        const fromCurrency = exchangeState.from.currency.ticker;
        const toCurrency = exchangeState.to.currency.ticker;
        const fromNetwork = exchangeState.from.currency.network;
        const toNetwork = exchangeState.to.currency.network;

        const { minAmount } = await apiClient.get<MinAmountResponse>(
          `/exchange/min-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}`,
        );

        if (Number(value) < minAmount) {
          setError(`Amount must be greater than ${minAmount}`);
          setExchangeState((prev) => ({
            ...prev,
            to: {
              ...prev.to,
              value: '',
            },
          }));
          return;
        }

        const { toAmount } = await apiClient.get<EstimatedAmountResponse>(
          // eslint-disable-next-line max-len
          `/exchange/estimated-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromAmount=${value}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}`,
        );

        setExchangeState((prev) => ({
          ...prev,
          from: {
            ...prev.from,
            value: value,
          },
          to: {
            ...prev.to,
            value: toAmount.toString(),
          },
        }));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch currencies');
      }
    },
    [
      apiClient,
      exchangeState.from.currency.network,
      exchangeState.from.currency.ticker,
      exchangeState.to.currency.network,
      exchangeState.to.currency.ticker,
    ],
  );

  const onChangeAddress = useCallback((address: string) => {
    setExchangeState((prev) => ({
      ...prev,
      address: address,
    }));
  }, []);

  const onSubmit = useCallback(async () => {
    if (!exchangeState.address) {
      setError('Please enter your wallet address');
      return;
    }
  }, [exchangeState.address]);

  const onSwap = useCallback(() => {
    setExchangeState((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  }, []);

  return {
    currenciesOptions,
    exchangeState,
    loading,
    error,
    setCurrency,
    setFromValue,
    onSubmit,
    onChangeAddress,
    onSwap,
  };
}
