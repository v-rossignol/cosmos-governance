import axios from 'axios';

export const authApi = axios.create({
  baseURL: '/infinity/auth',
  withCredentials: true,
});

export const adminApi = axios.create({
  baseURL: '/infinity/admin',
  withCredentials: true,
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
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
  withCredentials: true,
});
