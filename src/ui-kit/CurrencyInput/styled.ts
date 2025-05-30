import styled from 'styled-components';
import { Text } from '../Typography';
import { Horizontal } from '../Container';
import { Color } from '../constants/color';

interface ContainerProps {
  $isOpen: boolean;
}

export const Container = styled.div<ContainerProps>`
  position: relative;
  box-sizing: border-box;
  width: 450px;
  display: flex;
  flex-direction: ${({ $isOpen }) => ($isOpen ? 'column' : 'row')};
  align-items: ${({ $isOpen }) => ($isOpen ? 'stretch' : 'center')};
  background-color: ${Color.BACKGROUND};
  border: 1px solid ${({ $isOpen }) => ($isOpen ? '#80a2b6' : Color.LIGHT_GRAY)};
  border-radius: ${({ $isOpen }) => ($isOpen ? '5px 5px 0 0' : '5px')};
  transition: border-color 0.2s ease-in-out;

  &:focus-within {
    border-color: #80a2b6;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Dropdown = styled.div`
  margin-left: -1px;
  position: absolute;
  width: 100%;
  top: 50px;
  left: 0;
  background-color: ${Color.BACKGROUND};
  border: 1px solid #80a2b6;
  border-radius: 0 0 5px 5px;
  z-index: 2;
  max-height: 200px;
  overflow-y: auto;
`;

export const StyledInput = styled.input`
  padding: 16px;
  box-sizing: border-box;
  flex: 1;
  color: ${Color.DARK_GRAY};
  height: 50px;
  background: transparent;
  border: transparent;
  outline: transparent;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const StyledSelect = styled.div`
  padding: 16px;
  box-sizing: border-box;
  height: 50px;
  width: 150px;
  cursor: pointer;
  
`;

export const Divider = styled.span`
  width: 1px;
  height: 30px;
  background-color: ${Color.LIGHT_GRAY};
`;

export const InputWrap = styled.div`
  position: relative;
`;

export const ChevronContainer = styled.div`
  position: absolute;
  cursor: pointer;
  top: 50%;
  right: 8px;
  display: flex;
  transform: translateY(-50%);
`;

export const CloseContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 16px;
  display: flex;
  transform: translateY(-50%);
  cursor: pointer;
`;

export const CurrencyName = styled(Text)`
  color: #80a2b6;
`;

export const Ticker = styled(Text)`
  text-transform: uppercase;
`;

export const SelectItem = styled(Horizontal)`
  cursor: pointer;

  &:hover {
    background-color: #eaf1f7;
  }
`;
