import React from 'react';
import { GlobalStyle, Layout } from './styles';
import { ExchangeWidget } from './components/ExchangeWidget';
import { ApiClientProvider } from './context/api-client';
import { apiClient } from './api/client';

export function App() {
  return (
    <ApiClientProvider value={apiClient}>
      <GlobalStyle />
      <Layout>
        <ExchangeWidget />
      </Layout>
    </ApiClientProvider>
  );
}
