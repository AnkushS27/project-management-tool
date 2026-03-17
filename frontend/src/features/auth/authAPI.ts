import { axiosClient } from '../../services/axiosClient';
import type { User } from '../../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken?: string;
  user: User;
  message?: string;
}

export const loginRequest = async (payload: LoginPayload) => {
  const response = await axiosClient.post<AuthResponse>('/auth/login', payload);
  return response.data;
};

export const registerRequest = async (payload: RegisterPayload) => {
  const response = await axiosClient.post<AuthResponse>('/auth/register', payload);
  return response.data;
};
