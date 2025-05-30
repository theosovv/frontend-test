import styled, { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  
  body {
    font-family: Arial, sans-serif;
    background-color: #ffffff;
  }

  h1, h2, h3, h4, h5, h6, p, a {
    padding: 0;
    margin: 0;
  }
`;

export const Layout = styled.main`
  height: 100vh;
  padding: 64px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;
