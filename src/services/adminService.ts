import type {
  AdminStatistics,
  ListPlanetsParams,
  ListStarSystemsParams,
  ListUsersParams,
  PaginatedPlanets,
  PaginatedStarSystems,
  PaginatedUsers,
} from '@/types/admin';
import { adminApi } from './api';

export const adminService = {
  async getUsers(params: ListUsersParams = {}): Promise<PaginatedUsers> {
    const response = await adminApi.get<PaginatedUsers>('/users', { params });
    return response.data;
  },

  async getPlanets(params: ListPlanetsParams = {}): Promise<PaginatedPlanets> {
    const response = await adminApi.get<PaginatedPlanets>('/planets', { params });
    return response.data;
  },

  async getStarSystems(params: ListStarSystemsParams = {}): Promise<PaginatedStarSystems> {
    const response = await adminApi.get<PaginatedStarSystems>('/systems', { params });
    return response.data;
  },

  async getStatistics(): Promise<AdminStatistics> {
    const response = await adminApi.get<AdminStatistics>('/statistics');
    return response.data;
  },
};
