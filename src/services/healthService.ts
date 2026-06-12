import type { ServerHealth } from '@/types/health';
import { infinityApi } from './api';

export const healthService = {
  async getHealth(): Promise<ServerHealth> {
    const response = await infinityApi.get<ServerHealth>('/health');
    return response.data;
  },
};
