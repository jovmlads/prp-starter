import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface User extends SupabaseUser {
  user_metadata: UserMetadata;
}

export interface UserMetadata {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  acceptTerms?: boolean;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export interface AuthError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  preferences: UserPreferences | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
    tradingUpdates: boolean;
  };
  trading: {
    defaultSymbols: string[];
    chartSettings: Record<string, any>;
    riskSettings: Record<string, any>;
  };
}

export interface SessionInfo {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  ip_address: string;
  user_agent: string;
  is_current: boolean;
  expires_at: string;
}

export interface AuditEvent {
  id: string;
  user_id: string;
  action: string;
  resource?: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  error_details?: Record<string, any>;
  created_at: string;
}

// Auth hook return types
export interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T | null;
  error: AuthError | null;
  status: number;
  message?: string;
}

export interface LoginResponse {
  user: User;
  session: Session;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface RegisterResponse {
  user: User | null;
  session: Session | null;
  confirmation_sent: boolean;
}
