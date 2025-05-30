import React from 'react';
import { Vertical } from '../Container';
import { Text } from '../Typography';
import { FieldBoxProps } from './types';

export function FieldBox({ label, children }: FieldBoxProps) {
  return (
    <Vertical $width='100%' $gap='8px'>
      <Text>{label}</Text>
      {children}
    </Vertical>
  );
}
