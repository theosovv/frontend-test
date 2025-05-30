import styled from 'styled-components';
import { Color } from '../constants/color';

export const Input = styled.input`
  background-color: ${Color.BACKGROUND};
  border: 1px solid ${Color.LIGHT_GRAY};
  outline: transparent;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  padding: 16px;

  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: #80a2b6;
  }
`;
