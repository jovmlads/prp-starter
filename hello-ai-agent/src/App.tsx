import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootLayout } from './components/layout/root-layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import './styles/globals.css';

import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Settings from './pages/settings';
import Profile from './pages/profile';
import { LoginPage } from './features/auth/components/LoginPage';
import { useAuth } from './features/auth/hooks/use-login';

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />} 
      />
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} 
      />
      <Route element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
