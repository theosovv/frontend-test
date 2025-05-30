import styled from 'styled-components';
import { Color } from '../constants/color';

export const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid ${Color.BRAND};
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
