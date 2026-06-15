import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AdminPlanetSummary, AdminStatistics, PaginatedPlanets, PaginatedUsers } from '@/types/admin';
import type { User } from '@/types/auth';

const { adminGet } = vi.hoisted(() => ({
  adminGet: vi.fn(),
}));

vi.mock('@/services/api', () => ({
  adminApi: {
    get: adminGet,
  },
}));

import { adminService } from '@/services/adminService';

const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2026-06-12T10:00:00.000Z',
  },
];

const mockPlanets: AdminPlanetSummary[] = [
  {
    _id: 'planet-1',
    name: 'Aurora Prime',
    starSystemId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    type: 'rocky',
    radius: 10,
    resources: { iron: 42 },
    createdAt: '2026-06-12T10:00:00.000Z',
    updatedAt: '2026-06-12T10:00:00.000Z',
  },
];

const mockStatistics: AdminStatistics = {
  users: 3,
  cubes: 12,
  starSystems: 8,
  planets: 24,
};

describe('adminService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getUsers fetches a paginated user list', async () => {
    const mockPaginatedUsers: PaginatedUsers = {
      items: mockUsers,
      total: 1,
      page: 1,
      count: 20,
    };
    adminGet.mockResolvedValueOnce({ data: mockPaginatedUsers });

    await expect(adminService.getUsers()).resolves.toEqual(mockPaginatedUsers);
    expect(adminGet).toHaveBeenCalledWith('/users', { params: {} });
  });

  it('getUsers forwards page and count query params', async () => {
    const mockPaginatedUsers: PaginatedUsers = {
      items: mockUsers,
      total: 42,
      page: 3,
      count: 10,
    };
    adminGet.mockResolvedValueOnce({ data: mockPaginatedUsers });

    await expect(adminService.getUsers({ page: 3, count: 10 })).resolves.toEqual(
      mockPaginatedUsers,
    );
    expect(adminGet).toHaveBeenCalledWith('/users', { params: { page: 3, count: 10 } });
  });

  it('getPlanets fetches a paginated planet list', async () => {
    const mockPaginatedPlanets: PaginatedPlanets = {
      items: mockPlanets,
      total: 1,
      page: 1,
      count: 20,
    };
    adminGet.mockResolvedValueOnce({ data: mockPaginatedPlanets });

    await expect(adminService.getPlanets()).resolves.toEqual(mockPaginatedPlanets);
    expect(adminGet).toHaveBeenCalledWith('/planets', { params: {} });
  });

  it('getPlanets forwards page and count query params', async () => {
    const mockPaginatedPlanets: PaginatedPlanets = {
      items: mockPlanets,
      total: 42,
      page: 3,
      count: 10,
    };
    adminGet.mockResolvedValueOnce({ data: mockPaginatedPlanets });

    await expect(adminService.getPlanets({ page: 3, count: 10 })).resolves.toEqual(
      mockPaginatedPlanets,
    );
    expect(adminGet).toHaveBeenCalledWith('/planets', { params: { page: 3, count: 10 } });
  });

  it('getStatistics fetches entity counts', async () => {
    adminGet.mockResolvedValueOnce({ data: mockStatistics });

    await expect(adminService.getStatistics()).resolves.toEqual(mockStatistics);
    expect(adminGet).toHaveBeenCalledWith('/statistics');
  });
});
