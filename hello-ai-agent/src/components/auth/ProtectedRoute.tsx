import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { ProtectedRouteProps } from '../../types/auth';

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireGuest = false,
  redirectTo,
  fallback: Fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
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

  // Handle guest-only routes (login, register)
  if (requireGuest && isAuthenticated) {
    const redirect = redirectTo || '/home';
    return <Navigate to={redirect} state={{ from: location }} replace />;
  }

  // Handle protected routes that require authentication
  if (requireAuth && !isAuthenticated) {
    const redirect = redirectTo || '/login';
    return <Navigate to={redirect} state={{ from: location }} replace />;
  }

  // Handle inactive users
  if (requireAuth && isAuthenticated && user && !user.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
              <svg
                className="h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Account Suspended
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your account has been deactivated. Please contact support for
              assistance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render the protected content
  return <>{children}</>;
}

// Export a convenience component for auth-required routes
export function AuthGuard({
  children,
  fallback,
  redirectTo,
}: ProtectedRouteProps) {
  return (
    <ProtectedRoute
      requireAuth={true}
      requireGuest={false}
      redirectTo={redirectTo}
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
}

// Export a convenience component for guest-only routes
export function GuestGuard({
  children,
  fallback,
  redirectTo,
}: ProtectedRouteProps) {
  return (
    <ProtectedRoute
      requireAuth={false}
      requireGuest={true}
      redirectTo={redirectTo}
      fallback={fallback}
    >
      {children}
    </ProtectedRoute>
  );
}
