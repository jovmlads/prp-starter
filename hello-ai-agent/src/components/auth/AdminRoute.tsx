import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  redirectTo?: string;
}

export function AdminRoute({
  children,
  fallback: Fallback,
  redirectTo = '/home',
}: AdminRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    if (Fallback) {
      return <Fallback />;
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Alternative: Higher-order component for admin routes
export function withAdminAccess<P extends object>(
  Component: React.ComponentType<P>,
  redirectTo = '/home'
) {
  return function AdminProtectedComponent(props: P) {
    return (
      <AdminRoute redirectTo={redirectTo}>
        <Component {...props} />
      </AdminRoute>
    );
  };
}
