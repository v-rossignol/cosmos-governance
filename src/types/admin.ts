import type { User } from '@/types/auth';

export interface AdminStatistics {
  users: number;
  cubes: number;
  starSystems: number;
  planets: number;
  vehicules: number;
  buildings: number;
}

export type UnitCategory = 'vehicule' | 'building';

export type UnitSize = 'small' | 'medium' | 'large';

export interface AdminUnitTypeRule {
  range: 'hexagon';
  value: number;
}

export interface AdminUnitType {
  id: string;
  name: string;
  type: UnitCategory;
  size: UnitSize;
  mobility: boolean;
  speed: number | null;
  environments: string[];
  rules: AdminUnitTypeRule[];
  capabilities: Record<string, unknown>;
  description: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUnitTypeList {
  items: AdminUnitType[];
  total: number;
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

export interface SystemPlanetSummary {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  type: PlanetType;
  resources: Record<string, number>;
}

export interface AdminStarSystemSummary {
  _id: string;
  name: string;
  planets: SystemPlanetSummary[];
  visited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListStarSystemsParams {
  page?: number;
  count?: number;
}

export interface PaginatedStarSystems {
  items: AdminStarSystemSummary[];
  total: number;
  page: number;
  count: number;
}
