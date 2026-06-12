import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@stores/authStore';

interface AuthBootstrapProps {
  children: ReactNode;
}

export const AuthBootstrap = ({ children }: AuthBootstrapProps) => {
  useEffect(() => {
    void useAuthStore.getState().restoreSession();
  }, []);

  return <>{children}</>;
};
