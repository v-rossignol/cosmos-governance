import type { AdminStatistics } from '@/types/admin';
import type { User } from '@/types/auth';
import { adminApi } from './api';

export const adminService = {
  async getUsers(): Promise<User[]> {
    const response = await adminApi.get<User[]>('/users');
    return response.data;
  },

  async getStatistics(): Promise<AdminStatistics> {
    const response = await adminApi.get<AdminStatistics>('/statistics');
    return response.data;
  },
};
