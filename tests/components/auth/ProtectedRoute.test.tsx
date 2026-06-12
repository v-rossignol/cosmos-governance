import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types/auth';

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

const renderProtectedRoute = (initialPath = '/health') => {
  return render(
    <MemoryRouter
      initialEntries={[initialPath]}
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/health" element={<div>Health dashboard</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    resetStore();
  });

  it('shows a loading indicator while the session is being restored', () => {
    useAuthStore.setState({ hasCheckedSession: false });

    renderProtectedRoute();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('Health dashboard')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated users to login', () => {
    useAuthStore.setState({ hasCheckedSession: true, isAuthenticated: false });

    renderProtectedRoute();

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Health dashboard')).not.toBeInTheDocument();
  });

  it('redirects non-admin users to login', () => {
    useAuthStore.setState({
      hasCheckedSession: true,
      isAuthenticated: true,
      user: { ...mockUser, role: 'user' },
    });

    renderProtectedRoute();

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Health dashboard')).not.toBeInTheDocument();
  });

  it('renders child routes for authenticated admin users', () => {
    useAuthStore.setState({
      hasCheckedSession: true,
      isAuthenticated: true,
      user: mockUser,
    });

    renderProtectedRoute();

    expect(screen.getByText('Health dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });
});
