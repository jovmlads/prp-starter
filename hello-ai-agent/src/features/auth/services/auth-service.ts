import type { LoginFormData, LoginSuccessResponse, TokenData } from '../types/auth-types';
import { AuthError } from '../types/auth-types';

class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginFormData): Promise<LoginSuccessResponse> {
    // Dummy login credentials
    const validCredentials = [
      { email: 'admin@example.com', password: 'admin123' },
      { email: 'user@example.com', password: 'user123' },
      { email: 'demo@example.com', password: 'demo123' },
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials
    const isValid = validCredentials.some(
      cred => cred.email === credentials.email && cred.password === credentials.password
    );

    if (!isValid) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        'Invalid email or password. Try: admin@example.com / admin123',
        { field: 'root' }
      );
    }

    // Create dummy tokens
    const tokens: TokenData = {
      accessToken: `dummy-token-${Date.now()}`,
      refreshToken: `refresh-token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      tokenType: "Bearer",
    };

    const response: LoginSuccessResponse = {
      success: true,
      data: {
        user: {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0],
          role: credentials.email.includes('admin') ? 'admin' : 'user',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        },
        tokens,
        session: {
          sessionId: `session-${Date.now()}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
      },
      message: 'Login successful',
    };

    this.storeTokens(tokens);
    return response;
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
