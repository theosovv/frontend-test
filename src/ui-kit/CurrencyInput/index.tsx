import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useOutsideClick } from '@src/hooks/useOutsideClick';
import { CurrencyOption } from '@src/types/currency';
import { Horizontal } from '../Container';
import { CloseIcon } from '../Icons/CloseIcon';
import { CurrencyInputProps } from './types';
import { ChevronDownIcon } from '../Icons/ChevronDownIcon';
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
    estimateSize: useCallback(() => 50, []),
    overscan: 5,
    measureElement: undefined,
    getItemKey: useCallback(
      (index: number) => {
        const item = filteredCurrencies[index];
        return item ? item.name : index;
      },
      [filteredCurrencies],
    ),
  });

  const items = virtualizer.getVirtualItems();

  const handleClickOutside = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  const containerRef = useOutsideClick(handleClickOutside);

  const handleOpenDropdown = useCallback(() => {
    setIsOpen(true);
    setSearchQuery('');
  }, []);

  const handleCloseDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  const handleCurrencySelect = useCallback(
    (currencyOption: CurrencyOption) => {
      onCurrencyChange(currencyOption);
      setIsOpen(false);
      setSearchQuery('');
    },
    [onCurrencyChange],
  );

  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.scrollTop = 0;
    }
  }, [searchQuery]);

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
          <Dropdown>
            <div
              ref={parentRef}
              style={{
                height: '200px',
                overflow: 'auto',
                scrollBehavior: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {count > 0 ? (
                <div
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {items.map((virtualRow) => {
                    const currencyOption = filteredCurrencies[virtualRow.index];

                    if (!currencyOption) return null;

                    return (
                      <SelectItem
                        onClick={() => handleCurrencySelect(currencyOption)}
                        key={virtualRow.key}
                        data-index={virtualRow.index}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '52px',
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                        $padding='16px'
                        $align='center'
                        $justify='start'
                        $gap='12px'
                      >
                        <img
                          src={currencyOption.image}
                          alt={currencyOption.name}
                          style={{ width: '24px', height: '24px', flexShrink: 0 }}
                        />
                        <Ticker>{currencyOption.ticker}</Ticker>
                        <CurrencyName>{currencyOption.name}</CurrencyName>
                      </SelectItem>
                    );
                  })}
                </div>
              ) : (
                <SelectItem $padding='16px' $align='center' $justify='center' $gap='12px' style={{ height: '52px' }}>
                  <CurrencyName>No currencies found</CurrencyName>
                </SelectItem>
              )}
            </div>
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
