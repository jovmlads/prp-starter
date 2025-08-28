import Cookies from 'js-cookie';
import type {
  User,
  UserLogin,
  UserRegistration,
  AuthResponse,
  ApiClientConfig,
  RequestConfig,
} from '../types/auth';

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private withCredentials: boolean;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.withCredentials = config.withCredentials;
  }

  private async request<T = any>(config: RequestConfig): Promise<T> {
    const { url, method, data, headers = {}, params } = config;

    // Add authorization header if token exists
    const token = this.getStoredToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Build URL with query parameters
    let fullUrl: URL;
    if (this.baseURL) {
      fullUrl = new URL(url, this.baseURL);
    } else {
      // For relative URLs when baseURL is empty (MSW development mode)
      fullUrl = new URL(url, window.location.origin);
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        fullUrl.searchParams.append(key, String(value));
      });
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(fullUrl.toString(), {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: this.withCredentials ? 'include' : 'omit',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        throw new ApiError(
          responseData.message || 'Request failed',
          response.status
        );
      }

      return responseData;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError('Network error', 0);
    }
  }

  private getStoredToken(): string | null {
    // Try to get token from localStorage first, then cookies
    const localToken = localStorage.getItem('auth-token');
    if (localToken) return localToken;

    const cookieToken = Cookies.get('auth-token');
    return cookieToken || null;
  }

  private setStoredToken(token: string): void {
    localStorage.setItem('auth-token', token);
    Cookies.set('auth-token', token, {
      expires: 7, // 7 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  private removeStoredToken(): void {
    localStorage.removeItem('auth-token');
    Cookies.remove('auth-token');
  }

  private setStoredUser(user: User): void {
    localStorage.setItem('auth-user', JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const userData = localStorage.getItem('auth-user');
    return userData ? JSON.parse(userData) : null;
  }

  private removeStoredUser(): void {
    localStorage.removeItem('auth-user');
  }

  // Authentication methods
  async login(credentials: UserLogin): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>({
      url: '/api/auth/login',
      method: 'POST',
      data: credentials,
    });

    if (response.success && response.token && response.user) {
      this.setStoredToken(response.token);
      this.setStoredUser(response.user);
    }

    return response;
  }

  async register(userData: UserRegistration): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>({
      url: '/api/auth/register',
      method: 'POST',
      data: userData,
    });

    if (response.success && response.token && response.user) {
      this.setStoredToken(response.token);
      this.setStoredUser(response.user);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request({
        url: '/api/auth/logout',
        method: 'POST',
      });
    } finally {
      // Always clear local storage, even if the request fails
      this.removeStoredToken();
      this.removeStoredUser();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<{ success: boolean; user: User }>({
      url: '/api/auth/me',
      method: 'GET',
    });

    if (response.success && response.user) {
      this.setStoredUser(response.user);
      return response.user;
    }

    throw new ApiError('Failed to get current user', 401);
  }

  async getUsers(): Promise<any[]> {
    const response = await this.request<{ success: boolean; users: any[] }>({
      url: '/api/auth/users',
      method: 'GET',
    });

    if (response.success && response.users) {
      return response.users;
    }

    throw new ApiError('Failed to get users', 401);
  }

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<any> {
    const response = await this.request<{
      success: boolean;
      user: any;
      message: string;
    }>({
      url: `/api/auth/users/${userId}/role`,
      method: 'PATCH',
      data: { role },
    });

    if (response.success && response.user) {
      return response.user;
    }

    throw new ApiError('Failed to update user role', 400);
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>({
      url: '/api/auth/refresh',
      method: 'POST',
    });

    if (response.success && response.token && response.user) {
      this.setStoredToken(response.token);
      this.setStoredUser(response.user);
    }

    return response;
  }

  // Utility methods
  getToken(): string | null {
    return this.getStoredToken();
  }

  getUser(): User | null {
    return this.getStoredUser();
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  clearAuth(): void {
    this.removeStoredToken();
    this.removeStoredUser();
  }
}

// Custom error class for API errors
class ApiError extends Error {
  public statusCode: number;
  public field?: string;

  constructor(message: string, statusCode: number, field?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.field = field;
  }
}

// Create default client instance
const defaultConfig: ApiClientConfig = {
  baseURL: '', // Use relative URLs for MSW compatibility
  timeout: 10000, // 10 seconds
  withCredentials: true,
};

export const apiClient = new ApiClient(defaultConfig);

// Export for custom configurations
export { ApiClient, ApiError };

// Export convenience methods
export const authApi = {
  login: (credentials: UserLogin) => apiClient.login(credentials),
  register: (userData: UserRegistration) => apiClient.register(userData),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  getUsers: () => apiClient.getUsers(),
  updateUserRole: (userId: string, role: 'user' | 'admin') =>
    apiClient.updateUserRole(userId, role),
  refreshToken: () => apiClient.refreshToken(),
  getToken: () => apiClient.getToken(),
  getUser: () => apiClient.getUser(),
  isAuthenticated: () => apiClient.isAuthenticated(),
  clearAuth: () => apiClient.clearAuth(),
};
