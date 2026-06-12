import { create } from 'zustand';
import type { User } from '@/types/auth';
import { authService } from '@services/authService';
import { getErrorMessage } from '@utils/helpers';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCheckedSession: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

let sessionRestorePromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasCheckedSession: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(username, password);
      set({ user, isAuthenticated: true, isLoading: false, hasCheckedSession: true });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Login failed'), isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: getErrorMessage(error, 'Logout failed'),
      });
    }
  },

  restoreSession: async () => {
    if (get().hasCheckedSession) {
      return;
    }

    if (sessionRestorePromise) {
      await sessionRestorePromise;
      return;
    }

    sessionRestorePromise = (async () => {
      try {
        const user = await authService.getCurrentUser();
        set({
          user,
          isAuthenticated: !!user,
          hasCheckedSession: true,
        });
      } catch {
        set({
          user: null,
          isAuthenticated: false,
          hasCheckedSession: true,
        });
      } finally {
        sessionRestorePromise = null;
      }
    })();

    await sessionRestorePromise;
  },

  clearError: () => {
    set({ error: null });
  },
}));
