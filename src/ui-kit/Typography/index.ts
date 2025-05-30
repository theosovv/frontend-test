import styled from 'styled-components';
import { Color } from '../constants/color';

export const H1 = styled.h1`
  font-size: 50px;
  font-weight: 300;
  line-height: 1.2;
  color: ${Color.DARK_GRAY};

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

export const H5 = styled.h5`
  font-size: 20px;
  font-weight: 400;
  line-height: 1;
  color: ${Color.DARK_GRAY};
`;

export const Text = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  color: ${Color.DARK_GRAY};
`;
