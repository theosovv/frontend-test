import styled from 'styled-components';
import { Color } from '../constants/color';

export const Button = styled.button`
  background-color: ${Color.BRAND};
  outline: transparent;
  border-radius: 5px;
  width: fit-content;
  box-sizing: border-box;
  padding: 16px 59px;
  color: #ffffff;
  text-transform: uppercase;
  cursor: pointer;
  font-weight: 700;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
