export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: "Bearer";
}

export interface LoginSuccessResponse {
  success: true;
  data: {
    user: User;
    tokens: TokenData;
    session: {
      sessionId: string;
      expiresAt: string;
    };
  };
  message: string;
}

export interface AuthErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
