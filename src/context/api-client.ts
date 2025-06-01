import { createContext, useContext } from 'react';

import type { ApiClient } from '@src/api/client';

const ApiClientContext = createContext<ApiClient | null>(null);

export const ApiClientProvider = ApiClientContext.Provider;

export function useApiClient(): ApiClient {
  const apiClient = useContext(ApiClientContext);

  if (!apiClient) {
    throw new Error('ApiClientContext is not defined! Please check what are you using useApiClient in a child of ApiClientProvider!');
  }

  return apiClient;
}
