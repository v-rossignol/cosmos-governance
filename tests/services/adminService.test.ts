import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  AdminPlanetSummary,
  AdminStarSystemSummary,
  AdminStatistics,
  AdminUnitType,
  AdminUnitTypeList,
  PaginatedPlanets,
  PaginatedStarSystems,
  PaginatedUsers,
} from '@/types/admin';
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

const mockStarSystems: AdminStarSystemSummary[] = [
  {
    _id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Sol',
    planets: [
      {
        id: 'planet-1',
        name: 'Aurora Prime',
        x: 100,
        y: 200,
        radius: 10,
        type: 'rocky',
        resources: { iron: 42 },
      },
    ],
    visited: true,
    createdAt: '2026-06-12T10:00:00.000Z',
    updatedAt: '2026-06-12T10:00:00.000Z',
  },
];

const mockStatistics: AdminStatistics = {
  users: 3,
  cubes: 12,
  starSystems: 8,
  planets: 24,
  vehicules: 1,
  buildings: 0,
};

const mockVehicules: AdminUnitType[] = [
  {
    id: 'scout-x1',
    name: 'Scout-X1',
    type: 'vehicule',
    size: 'small',
    mobility: true,
    speed: 1,
    environments: ['desert', 'forest'],
    rules: [{ range: 'hexagon', value: 1 }],
    capabilities: { cargo: { size: 1000 } },
    description: 'Can explore, extract, and build small structures.',
    metadata: {},
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

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

  it('getStarSystems fetches a paginated star system list', async () => {
    const mockPaginatedStarSystems: PaginatedStarSystems = {
      items: mockStarSystems,
      total: 1,
      page: 1,
      count: 20,
    };
    adminGet.mockResolvedValueOnce({ data: mockPaginatedStarSystems });

    await expect(adminService.getStarSystems()).resolves.toEqual(mockPaginatedStarSystems);
    expect(adminGet).toHaveBeenCalledWith('/systems', { params: {} });
  });

  it('getStarSystems forwards page and count query params', async () => {
    const mockPaginatedStarSystems: PaginatedStarSystems = {
      items: mockStarSystems,
      total: 42,
      page: 3,
      count: 10,
    };
    adminGet.mockResolvedValueOnce({ data: mockPaginatedStarSystems });

    await expect(adminService.getStarSystems({ page: 3, count: 10 })).resolves.toEqual(
      mockPaginatedStarSystems,
    );
    expect(adminGet).toHaveBeenCalledWith('/systems', { params: { page: 3, count: 10 } });
  });

  it('getStatistics fetches entity counts', async () => {
    adminGet.mockResolvedValueOnce({ data: mockStatistics });

    await expect(adminService.getStatistics()).resolves.toEqual(mockStatistics);
    expect(adminGet).toHaveBeenCalledWith('/statistics');
  });

  it('getVehicules fetches catalog entries', async () => {
    const mockVehiculeList: AdminUnitTypeList = {
      items: mockVehicules,
      total: 1,
    };
    adminGet.mockResolvedValueOnce({ data: mockVehiculeList });

    await expect(adminService.getVehicules()).resolves.toEqual(mockVehiculeList);
    expect(adminGet).toHaveBeenCalledWith('/units/vehicules');
  });

  it('getVehicule returns a catalog entry by id', async () => {
    adminGet.mockResolvedValueOnce({ data: mockVehicules[0] });

    await expect(adminService.getVehicule('scout-x1')).resolves.toEqual(mockVehicules[0]);
    expect(adminGet).toHaveBeenCalledWith('/units/vehicules/scout-x1');
  });

  it('getVehicule returns null when id is not in the catalog', async () => {
    const notFoundError = {
      isAxiosError: true,
      response: { status: 404 },
    };
    adminGet.mockRejectedValueOnce(notFoundError);

    await expect(adminService.getVehicule('missing-id')).resolves.toBeNull();
    expect(adminGet).toHaveBeenCalledWith('/units/vehicules/missing-id');
  });
});
