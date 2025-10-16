import { API_BASE_URL } from '@/constants/env';
import type { AppStore } from '@/store';
import { selectToken, unauthorized } from '@/store/sessionSlice';
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

let storeRef: AppStore | null = null;

export const TOKEN_KEY = 'kerbz_auth_token';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export const initializeApi = (store: AppStore) => {
  storeRef = store;

  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      // Prefer Redux state token, fallback to SecureStore
      const stateToken = storeRef ? selectToken(storeRef.getState()) : null;
      let token = stateToken;
      if (!token) {
        try {
          token = await SecureStore.getItemAsync(TOKEN_KEY);
        } catch {}
      }
      if (token) {
        config.headers = config.headers || {};
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }
      return config;
    },
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      if (status === 401 && storeRef) {
        // Broad 401 handling
        storeRef.dispatch(unauthorized());
      }
      return Promise.reject(error);
    },
  );
};

export const persistToken = async (token: string | null) => {
  if (!token) {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      // ignore
    }
    return;
  }
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    });
  } catch {
    // ignore
  }
};

export const getPersistedToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
};
