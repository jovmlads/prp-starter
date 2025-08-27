import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Form error mapping utility
export const mapApiErrorToFormError = (error: any) => {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      return error.details?.reduce((acc: Record<string, string>, detail: any) => ({
        ...acc,
        [detail.field]: detail.message,
      }), {});
    
    case 'INVALID_CREDENTIALS':
      return { root: 'Invalid email or password' };
    
    case 'ACCOUNT_LOCKED':
      return { 
        root: `Account locked. Try again later.` 
      };
    
    case 'RATE_LIMIT_EXCEEDED':
      return { 
        root: `Too many attempts. Please try again in ${error.details?.retryAfter || 60} seconds.` 
      };
    
    default:
      return { root: 'An unexpected error occurred. Please try again.' };
  }
};
