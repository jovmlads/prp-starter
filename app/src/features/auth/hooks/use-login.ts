import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import type { LoginFormData, LoginSuccessResponse } from '../types/auth-types';
import { AuthError } from '../types/auth-types';

interface UseLoginOptions {
  onSuccess?: (response: LoginSuccessResponse) => void;
  onError?: (error: AuthError) => void;
}

export const useLogin = (options?: UseLoginOptions) => {
  return useMutation({
    mutationFn: async (data: LoginFormData): Promise<LoginSuccessResponse> => {
      return authService.login(data);
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: AuthError) => {
      options?.onError?.(error);
    },
  });
};

// Additional hook for authentication state
export const useAuth = () => {
  return {
    isAuthenticated: authService.isAuthenticated(),
    logout: authService.logout,
    getAccessToken: authService.getAccessToken,
  };
};
