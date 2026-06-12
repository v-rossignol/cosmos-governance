import axios from 'axios';
import { tokenStorage } from './tokenStorage';

export const authApi = axios.create({
  baseURL: '/infinity/auth',
});

export const adminApi = axios.create({
  baseURL: '/infinity/admin',
});

adminApi.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      tokenStorage.clear();
      void import('@stores/authStore').then(({ useAuthStore }) => {
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
          hasCheckedSession: true,
        });
      });
    }
    return Promise.reject(error);
  },
);

export const infinityApi = axios.create({
  baseURL: '/infinity',
});
