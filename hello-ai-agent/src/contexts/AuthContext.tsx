import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { authApi } from '../services/api';
import type {
  User,
  UserLogin,
  UserRegistration,
  AuthResponse,
  AuthContextType,
  AuthEvent,
} from '../types/auth';

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthEvent): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'TOKEN_REFRESH':
      return {
        ...state,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.loading,
      };

    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props interface
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Auto-refresh token when it's close to expiring
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      const refreshInterval = setInterval(
        () => {
          refreshToken();
        },
        5 * 60 * 1000
      ); // Refresh every 5 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [state.isAuthenticated]);

  const initializeAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { loading: true } });

      // Check if we have stored auth data
      const token = authApi.getToken();
      const storedUser = authApi.getUser();

      if (token && storedUser) {
        // Verify the token is still valid
        try {
          const currentUser = await authApi.getCurrentUser();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: currentUser, token },
          });
        } catch (error) {
          // Token is invalid, clear auth data
          authApi.clearAuth();
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: { loading: false } });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  };

  const login = async (credentials: UserLogin): Promise<AuthResponse> => {
    try {
      dispatch({ type: 'LOGIN_START' });

      const response = await authApi.login(credentials);

      if (response.success && response.user && response.token) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.user, token: response.token },
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during login';
      dispatch({
        type: 'LOGIN_ERROR',
        payload: { error: errorMessage },
      });
      throw error;
    }
  };

  const register = async (
    userData: UserRegistration
  ): Promise<AuthResponse> => {
    try {
      dispatch({ type: 'REGISTER_START' });

      const response = await authApi.register(userData);

      if (response.success && response.user && response.token) {
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: { user: response.user, token: response.token },
        });
      } else {
        throw new Error(response.message || 'Registration failed');
      }

      return response;
    } catch (error: any) {
      const errorMessage =
        error.message || 'An error occurred during registration';
      dispatch({
        type: 'REGISTER_ERROR',
        payload: { error: errorMessage },
      });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      if (!state.isAuthenticated) return;

      const response = await authApi.refreshToken();

      if (response.success && response.user && response.token) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.user, token: response.token },
        });
      }

      dispatch({ type: 'TOKEN_REFRESH' });
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout the user
      dispatch({ type: 'LOGOUT' });
      authApi.clearAuth();
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    refreshToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// Export the context for advanced use cases
export { AuthContext };
