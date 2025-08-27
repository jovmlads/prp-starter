import type { LoginFormData, LoginSuccessResponse } from '../types/auth-types';
import { AuthError } from '../types/auth-types';

class AuthService {
  private static instance: AuthService;
  private baseUrl = '/api/auth';

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginFormData): Promise<LoginSuccessResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID(),
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new AuthError(
          result.error.code,
          result.error.message,
          result.error.details
        );
      }

      this.storeTokens(result.data.tokens);
      return result as LoginSuccessResponse;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      
      throw new AuthError(
        'NETWORK_ERROR',
        'Unable to connect to the server. Please check your internet connection.',
        { originalError: error }
      );
    }
  }

  private storeTokens(tokens: any): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('tokenExpiresAt', tokens.expiresAt);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    
    if (!token || !expiresAt) {
      return false;
    }

    return new Date(expiresAt) > new Date();
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
  }
}

export const authService = AuthService.getInstance();
