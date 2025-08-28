import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { RootLayout } from './components/layout/root-layout';
import { ProtectedRoute, GuestGuard } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { ToastProvider } from './components/ui/toast';
import './styles/globals.css';

import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings';
import Profile from './pages/profile';
import FormPage from './pages/form';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Guest-only routes */}
              <Route
                path="/login"
                element={
                  <GuestGuard>
                    <LoginPage />
                  </GuestGuard>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestGuard>
                    <RegisterPage />
                  </GuestGuard>
                }
              />

              {/* Auth Dashboard route */}
              <Route
                path="/auth-dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected routes with layout */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <RootLayout>
                      <Routes>
                        <Route
                          path="/"
                          element={<Navigate to="/home" replace />}
                        />
                        <Route path="/home" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/form" element={<FormPage />} />
                        <Route
                          path="/users"
                          element={
                            <AdminRoute>
                              <UsersPage />
                            </AdminRoute>
                          }
                        />
                      </Routes>
                    </RootLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
