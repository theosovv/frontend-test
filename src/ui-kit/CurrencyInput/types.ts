import { CurrencyOption } from '@src/types/currency';

export interface CurrencyInputProps {
  value: string;
  currencyOptions: CurrencyOption[];
  selectedCurrency: CurrencyOption;
  onCurrencyChange: (currency: CurrencyOption) => void;
  onValueChange?: (value: string) => void;
  isReadOnly?: boolean;
}
