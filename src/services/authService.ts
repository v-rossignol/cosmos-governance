import type { SuccessResponse } from '@/types/api';
import type { AuthResponse, User } from '@/types/auth';
import { adminApi, authApi } from './api';

export const authService = {
  async login(username: string, password: string): Promise<User> {
    await authApi.post<AuthResponse>('/login', { username, password });

    try {
      const meResponse = await adminApi.get<User>('/me');
      return meResponse.data;
    } catch (error) {
      try {
        await authApi.post<SuccessResponse>('/logout');
      } catch {
        // Clear the cookie even when logout fails.
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await authApi.post<SuccessResponse>('/logout');
    } catch {
      // Always clear local user state even if the server request fails.
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await adminApi.get<User>('/me');
      return response.data;
    } catch {
      return null;
    }
  },
};
