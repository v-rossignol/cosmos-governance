import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@/types/auth';

const { authPost, adminGet } = vi.hoisted(() => ({
  authPost: vi.fn(),
  adminGet: vi.fn(),
}));

vi.mock('@/services/api', () => ({
  authApi: {
    post: authPost,
  },
  adminApi: {
    get: adminGet,
  },
}));

import { authService } from '@/services/authService';

const mockUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin',
  createdAt: '2026-06-12T10:00:00.000Z',
};

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login authenticates via cookie and returns the admin profile', async () => {
    authPost.mockResolvedValueOnce({
      data: { user: { id: '1', username: 'admin', email: 'admin@example.com' } },
    });
    adminGet.mockResolvedValueOnce({ data: mockUser });

    const user = await authService.login('admin', 'secret');

    expect(authPost).toHaveBeenCalledWith('/login', { username: 'admin', password: 'secret' });
    expect(adminGet).toHaveBeenCalledWith('/me');
    expect(user).toEqual(mockUser);
  });

  it('login logs out when the admin profile request fails', async () => {
    authPost
      .mockResolvedValueOnce({
        data: { user: { id: '1', username: 'pilot', email: 'pilot@example.com' } },
      })
      .mockResolvedValueOnce({ data: { success: true } });
    adminGet.mockRejectedValueOnce(new Error('Forbidden'));

    await expect(authService.login('pilot', 'secret')).rejects.toThrow('Forbidden');

    expect(authPost).toHaveBeenCalledWith('/logout');
  });

  it('logout posts to the logout endpoint', async () => {
    authPost.mockResolvedValueOnce({ data: { success: true } });

    await authService.logout();

    expect(authPost).toHaveBeenCalledWith('/logout');
  });

  it('logout completes even when the server request fails', async () => {
    authPost.mockRejectedValueOnce(new Error('Network error'));

    await expect(authService.logout()).resolves.toBeUndefined();
  });

  it('getCurrentUser returns the admin profile when the request succeeds', async () => {
    adminGet.mockResolvedValueOnce({ data: mockUser });

    await expect(authService.getCurrentUser()).resolves.toEqual(mockUser);
    expect(adminGet).toHaveBeenCalledWith('/me');
  });

  it('getCurrentUser returns null when the request fails', async () => {
    adminGet.mockRejectedValueOnce(new Error('Unauthorized'));

    await expect(authService.getCurrentUser()).resolves.toBeNull();
  });
});
