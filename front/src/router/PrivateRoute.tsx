// router/PrivateRoute.tsx
// Guard par rôle — conforme à ai-context.md section 5 & 8

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { Role } from '../types/user.types';
import { PageLoader } from '../components/ui/Spinner';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user            = useAuthStore((s) => s.user);
  const location        = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Rediriger vers le bon dashboard selon le rôle
    const redirectMap: Record<Role, string> = {
      membre:       '/tableau-de-bord',
      organisateur: '/orga/tableau-de-bord',
      admin:        '/admin',
    };
    return <Navigate to={redirectMap[user.role]} replace />;
  }

  return <>{children}</>;
};
