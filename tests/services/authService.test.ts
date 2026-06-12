import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@/types/auth';

const { authPost, adminGet } = vi.hoisted(() => ({
  authPost: vi.fn(),
  adminGet: vi.fn(),
}));

const { getToken, setToken, clearToken } = vi.hoisted(() => ({
  getToken: vi.fn(),
  setToken: vi.fn(),
  clearToken: vi.fn(),
}));

vi.mock('@/services/api', () => ({
  authApi: {
    post: authPost,
  },
  adminApi: {
    get: adminGet,
  },
}));

vi.mock('@/services/tokenStorage', () => ({
  tokenStorage: {
    get: getToken,
    set: setToken,
    clear: clearToken,
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

  it('login stores the token and returns the admin profile', async () => {
    authPost.mockResolvedValueOnce({ data: { access_token: 'jwt-token' } });
    adminGet.mockResolvedValueOnce({ data: mockUser });

    const user = await authService.login('admin', 'secret');

    expect(authPost).toHaveBeenCalledWith('/login', { username: 'admin', password: 'secret' });
    expect(setToken).toHaveBeenCalledWith('jwt-token');
    expect(adminGet).toHaveBeenCalledWith('/me');
    expect(user).toEqual(mockUser);
  });

  it('login clears the token when the admin profile request fails', async () => {
    authPost.mockResolvedValueOnce({ data: { access_token: 'jwt-token' } });
    adminGet.mockRejectedValueOnce(new Error('Forbidden'));

    await expect(authService.login('pilot', 'secret')).rejects.toThrow('Forbidden');

    expect(clearToken).toHaveBeenCalled();
  });

  it('logout posts to the logout endpoint and clears the token', async () => {
    getToken.mockReturnValueOnce('jwt-token');
    authPost.mockResolvedValueOnce({ data: { success: true } });

    await authService.logout();

    expect(authPost).toHaveBeenCalledWith(
      '/logout',
      {},
      { headers: { Authorization: 'Bearer jwt-token' } },
    );
    expect(clearToken).toHaveBeenCalled();
  });

  it('logout clears the token even when the server request fails', async () => {
    getToken.mockReturnValueOnce('jwt-token');
    authPost.mockRejectedValueOnce(new Error('Network error'));

    await authService.logout();

    expect(clearToken).toHaveBeenCalled();
  });

  it('getCurrentUser returns null when no token is stored', async () => {
    getToken.mockReturnValueOnce(null);

    await expect(authService.getCurrentUser()).resolves.toBeNull();
    expect(adminGet).not.toHaveBeenCalled();
  });

  it('getCurrentUser returns the admin profile when the request succeeds', async () => {
    getToken.mockReturnValueOnce('jwt-token');
    adminGet.mockResolvedValueOnce({ data: mockUser });

    await expect(authService.getCurrentUser()).resolves.toEqual(mockUser);
    expect(adminGet).toHaveBeenCalledWith('/me');
  });

  it('getCurrentUser clears the token and returns null when the request fails', async () => {
    getToken.mockReturnValueOnce('jwt-token');
    adminGet.mockRejectedValueOnce(new Error('Unauthorized'));

    await expect(authService.getCurrentUser()).resolves.toBeNull();
    expect(clearToken).toHaveBeenCalled();
  });
});
