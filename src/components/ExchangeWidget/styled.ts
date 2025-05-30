import { Text } from '@src/ui-kit/Typography';
import styled from 'styled-components';

export const SwapIconContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  @media (max-width: 768px) {
    margin-left: auto;
    transform: rotate(90deg);
  }
`;

export const ErrorMessage = styled(Text)`
  color: #e03f3f;
`;
