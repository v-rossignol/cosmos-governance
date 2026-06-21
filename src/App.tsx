import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthBootstrap } from '@components/auth/AuthBootstrap';
import { AuthLayout } from '@components/auth/AuthLayout';
import { ProtectedRoute } from '@components/auth/ProtectedRoute';
import { AdminLayout } from '@components/layout/AdminLayout';
import { PageBackground } from '@components/layout/PageBackground';
import { LoginPage } from '@pages/LoginPage';
import { ServerHealthPage } from '@pages/ServerHealthPage';
import { PlanetsPage } from '@pages/PlanetsPage';
import { StarSystemsPage } from '@pages/StarSystemsPage';
import { UsersPage } from '@pages/UsersPage';
import { VehiculesPage } from '@pages/VehiculesPage';
import { VehiculeDetailPage } from '@pages/VehiculeDetailPage';
import { useAuthStore } from '@stores/authStore';

const GuestLoginPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasCheckedSession = useAuthStore((state) => state.hasCheckedSession);

  if (hasCheckedSession && isAuthenticated) {
    return <Navigate to="/health" replace />;
  }

  return <LoginPage />;
};

function App() {
  return (
    <AuthBootstrap>
      <PageBackground />
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthLayout />}>
          <Route index element={<GuestLoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/health" replace />} />
            <Route path="health" element={<ServerHealthPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="star-systems" element={<StarSystemsPage />} />
            <Route path="planets" element={<PlanetsPage />} />
            <Route path="vehicules" element={<VehiculesPage />} />
            <Route path="vehicules/:vehiculeId" element={<VehiculeDetailPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthBootstrap>
  );
}

export default App;
