import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ServerHealth } from '@/types/health';

const { get } = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock('@/services/api', () => ({
  infinityApi: {
    get,
  },
}));

import { healthService } from '@/services/healthService';

const mockHealth: ServerHealth = {
  name: 'infinity',
  version: '1.0.0',
  status: 'ok',
};

describe('healthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getHealth fetches server health from /health', async () => {
    get.mockResolvedValueOnce({ data: mockHealth });

    await expect(healthService.getHealth()).resolves.toEqual(mockHealth);
    expect(get).toHaveBeenCalledWith('/health');
  });
});
