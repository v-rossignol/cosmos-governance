import type { SuccessResponse } from '@/types/api';
import type { LoginResponse, User } from '@/types/auth';
import { adminApi, authApi } from './api';
import { tokenStorage } from './tokenStorage';

export const authService = {
  async login(username: string, password: string): Promise<User> {
    const response = await authApi.post<LoginResponse>('/login', { username, password });
    tokenStorage.set(response.data.access_token);

    try {
      const meResponse = await adminApi.get<User>('/me');
      return meResponse.data;
    } catch (error) {
      tokenStorage.clear();
      throw error;
    }
  },

  async logout(): Promise<void> {
    const token = tokenStorage.get();

    try {
      if (token) {
        await authApi.post<SuccessResponse>(
          '/logout',
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
    } catch {
      // Always clear the local session even if the server request fails.
    } finally {
      tokenStorage.clear();
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (!tokenStorage.get()) {
      return null;
    }

    try {
      const response = await adminApi.get<User>('/me');
      return response.data;
    } catch {
      tokenStorage.clear();
      return null;
    }
  },
};
