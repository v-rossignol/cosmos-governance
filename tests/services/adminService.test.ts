import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AdminStatistics } from '@/types/admin';
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

  it('getUsers fetches the user list', async () => {
    adminGet.mockResolvedValueOnce({ data: mockUsers });

    await expect(adminService.getUsers()).resolves.toEqual(mockUsers);
    expect(adminGet).toHaveBeenCalledWith('/users');
  });

  it('getStatistics fetches entity counts', async () => {
    adminGet.mockResolvedValueOnce({ data: mockStatistics });

    await expect(adminService.getStatistics()).resolves.toEqual(mockStatistics);
    expect(adminGet).toHaveBeenCalledWith('/statistics');
  });
});
