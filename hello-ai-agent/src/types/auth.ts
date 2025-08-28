// User related types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserLogin {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Session and authentication types
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: number;
  lastActivityAt: number;
}

export interface LoginAttempt {
  id: string;
  email: string;
  success: boolean;
  ipAddress: string;
  userAgent: string;
  attemptedAt: number;
}

// API Response types
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface ApiError {
  message: string;
  field?: string;
  statusCode: number;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Form validation types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Context types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserLogin) => Promise<AuthResponse>;
  register: (userData: UserRegistration) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  error: string | null;
}

// Hook types
export interface UseAuthReturn extends AuthContextType {}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (field: keyof T, value: any) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (
    onSubmit: (values: T) => void | Promise<void>
  ) => Promise<void>;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => string | null;
  validateForm: () => boolean;
}

// Component prop types
export interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  showRegisterLink?: boolean;
  className?: string;
}

export interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  showLoginLink?: boolean;
  className?: string;
}

export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  redirectTo?: string;
}

// Utility types
export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

export type FormField<T> = {
  name: keyof T;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  validation?: (value: any) => string | null;
};

// Storage types
export interface AuthStorage {
  getToken: () => string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
  getUser: () => User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
}

// API Client types
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  withCredentials: boolean;
}

export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

// Router types
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
  redirectTo?: string;
  fallback?: React.ComponentType;
}

// Test types
export interface MockUser extends User {
  password: string;
}

export interface TestAuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

// Event types
export type AuthEvent =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_ERROR'; payload: { error: string } }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_ERROR'; payload: { error: string } }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_REFRESH' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: { loading: boolean } };

// Configuration types
export interface AuthConfig {
  apiBaseUrl: string;
  tokenStorageKey: string;
  userStorageKey: string;
  enableRememberMe: boolean;
  sessionTimeout: number;
  refreshThreshold: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}
