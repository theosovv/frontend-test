import React from 'react';
import { H1, H5, Vertical, CurrencyInput, Horizontal, Input, Button, FieldBox } from '@src/ui-kit';
import { useExchange } from './hooks/useExchange';
import { Loader } from '@src/ui-kit/Loader';
import { SwapIcon } from '@src/ui-kit/Icons/SwapIcon';
import { ErrorMessage, SwapIconContainer } from './styled';

export function ExchangeWidget() {
  const { currenciesOptions, exchangeState, loading, error, setCurrency, setFromValue, onChangeAddress, onSubmit, onSwap } = useExchange();

  if (loading) {
    return <Loader />;
  }

  return (
    <Vertical $gap='60px'>
      <Vertical $gap='16px'>
        <H1>Crypto Exchange</H1>
        <H5>Exchange fast and easy</H5>
      </Vertical>
      <Vertical $gap='32px'>
        <Horizontal $gap='24px' $align='center'>
          <CurrencyInput
            value={exchangeState.from.value}
            currencyOptions={currenciesOptions}
            selectedCurrency={exchangeState.from.currency}
            onCurrencyChange={(currency) => setCurrency('from', currency)}
            onValueChange={setFromValue}
          />
          <SwapIconContainer onClick={onSwap}>
            <SwapIcon />
          </SwapIconContainer>
          <CurrencyInput
            value={exchangeState.to.value}
            currencyOptions={currenciesOptions}
            selectedCurrency={exchangeState.to.currency}
            onCurrencyChange={(currency) => setCurrency('to', currency)}
            isReadOnly
          />
        </Horizontal>
        <Horizontal $gap='32px' $align='end'>
          <FieldBox label={`Your ${exchangeState.to.currency.name} address`}>
            <Input value={exchangeState.address} onChange={(e) => onChangeAddress(e.target.value)} />
          </FieldBox>
          <Button onClick={onSubmit}>Exchange</Button>
        </Horizontal>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Vertical>
    </Vertical>
  );
}
