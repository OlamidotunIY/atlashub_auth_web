import axios, { type AxiosInstance } from 'axios';
import type { TokenStoragePort } from '../../application/ports/token-storage.port';

export function createApiClient(tokenStorage: TokenStoragePort): AxiosInstance {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    timeout: 15000,
  });

  client.interceptors.request.use((config) => {
    const tokens = tokenStorage.getTokens();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const responseData = error.response?.data;
      const message =
        responseData?.message ||
        responseData?.error ||
        error.message ||
        'An unexpected error occurred';
      return Promise.reject(new Error(message));
    }
  );

  return client;
}
