import type { User } from '@/types/auth';

export interface AdminStatistics {
  users: number;
  cubes: number;
  starSystems: number;
  planets: number;
}

export interface ListUsersParams {
  page?: number;
  count?: number;
}

export interface PaginatedUsers {
  items: User[];
  total: number;
  page: number;
  count: number;
}

export type PlanetType = 'rocky' | 'gas' | 'ice' | 'lava';

export interface AdminPlanetSummary {
  _id: string;
  name: string;
  starSystemId: string;
  type: PlanetType;
  radius: number;
  resources: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface ListPlanetsParams {
  page?: number;
  count?: number;
}

export interface PaginatedPlanets {
  items: AdminPlanetSummary[];
  total: number;
  page: number;
  count: number;
}
