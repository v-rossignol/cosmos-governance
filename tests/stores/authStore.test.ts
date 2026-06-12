import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@/types/auth';

const { login, logout, getCurrentUser } = vi.hoisted(() => ({
  login: vi.fn(),
  logout: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock('@/services/authService', () => ({
  authService: {
    login,
    logout,
    getCurrentUser,
  },
}));

import { useAuthStore } from '@/stores/authStore';

const mockUser: User = {
  id: '1',
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin',
  createdAt: '2026-06-12T10:00:00.000Z',
};

const resetStore = () => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    hasCheckedSession: false,
    error: null,
  });
};

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  it('login stores the authenticated user on success', async () => {
    login.mockResolvedValueOnce(mockUser);

    await useAuthStore.getState().login('admin', 'secret');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.hasCheckedSession).toBe(true);
    expect(state.error).toBeNull();
  });

  it('login sets an error message and rethrows on failure', async () => {
    const error = new axios.AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
        data: { message: 'Invalid credentials', statusCode: 401 },
      },
    );
    login.mockRejectedValueOnce(error);

    await expect(useAuthStore.getState().login('admin', 'wrong')).rejects.toThrow();

    const state = useAuthStore.getState();
    expect(state.error).toBe('Invalid credentials');
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('logout clears the session', async () => {
    useAuthStore.setState({ user: mockUser, isAuthenticated: true });
    logout.mockResolvedValueOnce(undefined);

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(logout).toHaveBeenCalledOnce();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('logout clears local auth state even when the request fails', async () => {
    useAuthStore.setState({ user: mockUser, isAuthenticated: true });
    logout.mockRejectedValueOnce(new Error('Network error'));

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('restoreSession hydrates the user when a session exists', async () => {
    getCurrentUser.mockResolvedValueOnce(mockUser);

    await useAuthStore.getState().restoreSession();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.hasCheckedSession).toBe(true);
  });

  it('restoreSession marks the session as checked when unauthenticated', async () => {
    getCurrentUser.mockResolvedValueOnce(null);

    await useAuthStore.getState().restoreSession();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.hasCheckedSession).toBe(true);
  });

  it('restoreSession runs only once per app load', async () => {
    getCurrentUser.mockResolvedValue(mockUser);

    await useAuthStore.getState().restoreSession();
    await useAuthStore.getState().restoreSession();

    expect(getCurrentUser).toHaveBeenCalledOnce();
  });

  it('clearError removes the current error', () => {
    useAuthStore.setState({ error: 'Something failed' });

    useAuthStore.getState().clearError();

    expect(useAuthStore.getState().error).toBeNull();
  });
});
