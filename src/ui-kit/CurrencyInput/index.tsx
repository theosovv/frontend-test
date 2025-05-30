import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useOutsideClick } from '@src/hooks/useOutsideClick';
import {
  ChevronContainer,
  CloseContainer,
  Container,
  Divider,
  Dropdown,
  InputWrap,
  StyledInput,
  StyledSelect,
  CurrencyName,
  Ticker,
  SelectItem,
} from './styled';
import { Horizontal } from '../Container';
import { CloseIcon } from '../Icons/CloseIcon';
import { CurrencyInputProps } from './types';
import { ChevronDownIcon } from '../Icons/ChevronDownIcon';

export function CurrencyInput(props: CurrencyInputProps) {
  const { value, currencyOptions, selectedCurrency, onCurrencyChange, onValueChange, isReadOnly } = props;
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const parentRef = useRef<HTMLDivElement>(null);
  const filteredCurrencies = useMemo(() => {
    if (!searchQuery.trim()) {
      return currencyOptions;
    }

    const query = searchQuery.toLowerCase();

    return currencyOptions.filter(
      (currency) => currency.name.toLowerCase().includes(query) || currency.ticker.toLowerCase().includes(query),
    );
  }, [currencyOptions, searchQuery]);
  const count = filteredCurrencies.length;
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    enabled: isOpen,
    measureElement: undefined,
    overscan: 5,
  });

  const items = virtualizer.getVirtualItems();

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const handleOpenDropdown = () => {
    setIsOpen(true);
    setSearchQuery('');
  };

  const handleCloseDropdown = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const containerRef = useOutsideClick(handleClickOutside);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Container ref={containerRef} $isOpen={isOpen}>
      {isOpen && (
        <>
          <InputWrap>
            <StyledInput
              placeholder='Search'
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <CloseContainer onClick={handleCloseDropdown}>
              <CloseIcon />
            </CloseContainer>
          </InputWrap>
          <Dropdown ref={parentRef}>
            {items.map((virtualRow) => {
              const currencyOption = filteredCurrencies[virtualRow.index];

              return (
                <SelectItem
                  onClick={() => {
                    onCurrencyChange(currencyOption);
                    setIsOpen(false);
                  }}
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  $padding='16px'
                  $align='center'
                  $justify='start'
                  $gap='12px'
                >
                  <img src={currencyOption.image} alt={currencyOption.name} />
                  <Ticker>{currencyOption.ticker}</Ticker>
                  <CurrencyName>{currencyOption.name}</CurrencyName>
                </SelectItem>
              );
            })}
          </Dropdown>
        </>
      )}
      {!isOpen && (
        <>
          <StyledInput
            readOnly={isReadOnly}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => onValueChange && onValueChange(inputValue)}
            type='number'
          />
          <Divider />
          <InputWrap onClick={handleOpenDropdown}>
            <StyledSelect>
              <Horizontal $gap='12px' $justify='center' $align='center'>
                {selectedCurrency.image && <img src={selectedCurrency?.image} alt={selectedCurrency?.name} />}
                <Ticker>{selectedCurrency?.ticker}</Ticker>
              </Horizontal>
            </StyledSelect>
            <ChevronContainer>
              <ChevronDownIcon />
            </ChevronContainer>
          </InputWrap>
        </>
      )}
    </Container>
  );
}
