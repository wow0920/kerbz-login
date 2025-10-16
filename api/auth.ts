import type { LoginResponse, UserInfo } from '@/constants/types';
import { api } from './client';

export const loginApi = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/login', { email, password });
  return res.data;
};

export const meApi = async (): Promise<UserInfo> => {
  const res = await api.get<UserInfo>('/me');
  return res.data;
};

export const logoutApi = async (): Promise<unknown> => {
  const res = await api.post('/logout');
  return res.data as unknown;
};
