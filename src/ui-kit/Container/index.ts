import styled from 'styled-components';
import { ContainerProps } from './types';

export const Vertical = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap || '0'};
  align-items: ${({ $align }) => $align || 'stretch'};
  justify-content: ${({ $justify }) => $justify || 'stretch'};
  padding: ${({ $padding }) => $padding || '0'};
  margin: ${({ $margin }) => $margin || '0'};
  width: ${({ $width }) => $width || 'auto'};

  @media (max-width: 768px) {
    width: ${({ $width }) => $width || '100%'};
  }
`;

export const Horizontal = styled.div<ContainerProps>`
  display: flex;
  flex-direction: row;
  gap: ${({ $gap }) => $gap || '0'};
  align-items: ${({ $align }) => $align || 'stretch'};
  justify-content: ${({ $justify }) => $justify || 'stretch'};
  padding: ${({ $padding }) => $padding || '0'};
  margin: ${({ $margin }) => $margin || '0'};
  width: ${({ $width }) => $width || 'auto'};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: ${({ $width }) => $width || '100%'};
  }
`;
