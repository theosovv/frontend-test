import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApiClient } from '@src/context/api-client';
import { Currency, CurrencyOption, ExchangeState } from '@src/types/currency';
import { ExchangeService } from '@src/api/exchangeService';

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
  const exchangeService = useMemo(() => {
    return new ExchangeService(apiClient);
  }, [apiClient]);

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

        const data = await exchangeService.getCurrencies();

        setCurrencies(data);

        if (data.length >= 2) {
          const fromCurrency = data[0].ticker;
          const toCurrency = data[1].ticker;
          const fromNetwork = data[0].network;
          const toNetwork = data[1].network;

          const minAmount = await exchangeService.getMinAmount(fromCurrency, toCurrency, fromNetwork, toNetwork);

          if (minAmount === null) {
            setError('This pair is disabled now.');
            return;
          }

          const toAmount = await exchangeService.getEstimatedAmount(
            fromCurrency,
            toCurrency,
            fromNetwork,
            toNetwork,
            minAmount,
          );

          if (toAmount === null) {
            setError('This pair is disabled now.');
            return;
          }

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
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch currencies');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, [exchangeService]);

  const setCurrency = useCallback(
    async (side: 'from' | 'to', currency: CurrencyOption) => {
      try {
        setError(null);

        const fromCurrency = side === 'from' ? currency : exchangeState.from.currency;
        const toCurrency = side === 'to' ? currency : exchangeState.to.currency;
        const fromNetwork = side === 'from' ? currency.network : exchangeState.from.currency.network;
        const toNetwork = side === 'to' ? currency.network : exchangeState.to.currency.network;

        if (fromCurrency.ticker === toCurrency.ticker && fromNetwork === toNetwork) {
          setError('Cannot exchange the same currency');
          return;
        }

        const minAmount = await exchangeService.getMinAmount(
          fromCurrency.ticker,
          toCurrency.ticker,
          fromNetwork,
          toNetwork,
        );

        if (minAmount === null) {
          setError('This pair is disabled now.');
          return;
        }

        const toAmount = await exchangeService.getEstimatedAmount(
          fromCurrency.ticker,
          toCurrency.ticker,
          fromNetwork,
          toNetwork,
          minAmount,
        );

        if (toAmount === null) {
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
          address: exchangeState.address,
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to set currency');
      }
    },
    [exchangeService, exchangeState.from.currency, exchangeState.to.currency, exchangeState.address],
  );

  const setFromValue = useCallback(
    async (value: string) => {
      try {
        setError(null);

        if (!value || value === '') {
          setExchangeState((prev) => ({
            ...prev,
            from: {
              ...prev.from,
              value: value,
            },
            to: {
              ...prev.to,
              value: '',
            },
          }));
          return;
        }

        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) {
          setError('Please enter a valid amount');
          setExchangeState((prev) => ({
            ...prev,
            from: {
              ...prev.from,
              value: value,
            },
            to: {
              ...prev.to,
              value: '',
            },
          }));
          return;
        }

        const fromCurrency = exchangeState.from.currency.ticker;
        const toCurrency = exchangeState.to.currency.ticker;
        const fromNetwork = exchangeState.from.currency.network;
        const toNetwork = exchangeState.to.currency.network;

        const minAmount = await exchangeService.getMinAmount(fromCurrency, toCurrency, fromNetwork, toNetwork);

        if (minAmount === null) {
          setError('This pair is disabled now.');
          setExchangeState((prev) => ({
            ...prev,
            from: {
              ...prev.from,
              value: value,
            },
            to: {
              ...prev.to,
              value: '-',
            },
          }));
          return;
        }

        if (numValue < minAmount) {
          setError(`Amount must be greater than ${minAmount}`);
          setExchangeState((prev) => ({
            ...prev,
            from: {
              ...prev.from,
              value: value,
            },
            to: {
              ...prev.to,
              value: '-',
            },
          }));
          return;
        }

        const toAmount = await exchangeService.getEstimatedAmount(
          fromCurrency,
          toCurrency,
          fromNetwork,
          toNetwork,
          numValue,
        );

        if (toAmount === null) {
          setError('This pair is disabled now.');
          setExchangeState((prev) => ({
            ...prev,
            from: {
              ...prev.from,
              value: value,
            },
            to: {
              ...prev.to,
              value: '-',
            },
          }));
          return;
        }

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
        setError(error instanceof Error ? error.message : 'Failed to calculate exchange amount');
        setExchangeState((prev) => ({
          ...prev,
          from: {
            ...prev.from,
            value: value,
          },
          to: {
            ...prev.to,
            value: '-',
          },
        }));
      }
    },
    [
      exchangeService,
      exchangeState.from.currency.network,
      exchangeState.from.currency.ticker,
      exchangeState.to.currency.network,
      exchangeState.to.currency.ticker,
    ],
  );

  const onChangeAddress = useCallback((address: string) => {
    setError(null);
    setExchangeState((prev) => ({
      ...prev,
      address: address,
    }));
  }, []);

  const onSubmit = useCallback(async () => {
    if (error) return;

    if (!exchangeState.address) {
      setError('Please enter your wallet address');
      return;
    }

    if (!exchangeState.from.value || exchangeState.to.value === '-' || !exchangeState.to.value) {
      setError('Please enter a valid exchange amount');
      return;
    }
  }, [error, exchangeState.address, exchangeState.from.value, exchangeState.to.value]);

  const onSwap = useCallback(async () => {
    try {
      setError(null);

      const newFromCurrency = exchangeState.to.currency;
      const newToCurrency = exchangeState.from.currency;

      if (newFromCurrency.ticker === newToCurrency.ticker && newFromCurrency.network === newToCurrency.network) {
        setError('Cannot exchange the same currency');
        return;
      }

      const minAmount = await exchangeService.getMinAmount(
        newFromCurrency.ticker,
        newToCurrency.ticker,
        newFromCurrency.network,
        newToCurrency.network,
      );

      if (minAmount === null) {
        setError('This pair is disabled now.');
        return;
      }

      const estimatedAmount = await exchangeService.getEstimatedAmount(
        newFromCurrency.ticker,
        newToCurrency.ticker,
        newFromCurrency.network,
        newToCurrency.network,
        minAmount,
      );

      if (estimatedAmount === null) {
        setError('This pair is disabled now.');
        return;
      }

      setExchangeState((prev) => ({
        ...prev,
        from: {
          currency: newFromCurrency,
          value: minAmount.toString(),
        },
        to: {
          currency: newToCurrency,
          value: estimatedAmount.toString(),
        },
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to swap currencies');
    }
  }, [exchangeService, exchangeState.from.currency, exchangeState.to.currency]);

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
