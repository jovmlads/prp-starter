import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

// Security configuration constants
export const JWT_SECRET = 'your-dev-secret-key-change-in-production';
export const JWT_EXPIRES_IN = '7d';
export const BCRYPT_ROUNDS = 10;
export const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Browser-compatible JWT utilities (simplified for development/testing)
export const generateToken = (payload: Record<string, any>): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 7 * 24 * 60 * 60; // 7 days

  const tokenPayload = {
    ...payload,
    iat: now,
    exp: exp,
  };

  // Simple base64 encoding for development (not cryptographically secure)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(tokenPayload));
  const signature = btoa(`${encodedHeader}.${encodedPayload}.${JWT_SECRET}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const verifyToken = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);

    // Check if token is expired
    if (payload.exp && payload.exp < now) {
      return null;
    }

    // Verify signature (simple check for development)
    const expectedSignature = btoa(`${parts[0]}.${parts[1]}.${JWT_SECRET}`);
    if (parts[2] !== expectedSignature) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
};

// Session utilities
export const generateSessionId = (): string => {
  return nanoid();
};

export const isSessionExpired = (expiresAt: Date): boolean => {
  return new Date() > new Date(expiresAt);
};

export const calculateExpirationDate = (): Date => {
  return new Date(Date.now() + SESSION_DURATION);
};

// Cookie utilities (server-side representation)
export const createCookieHeader = (
  name: string,
  value: string,
  options: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
    path?: string;
  } = {}
): string => {
  const {
    httpOnly = true,
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'lax',
    maxAge = SESSION_DURATION / 1000, // Convert to seconds
    path = '/',
  } = options;

  let cookie = `${name}=${value}; Path=${path}; Max-Age=${maxAge}; SameSite=${sameSite}`;

  if (httpOnly) cookie += '; HttpOnly';
  if (secure) cookie += '; Secure';

  return cookie;
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Error utilities
export const createErrorResponse = (
  message: string,
  field?: string,
  statusCode = 400
) => {
  return {
    message,
    field,
    statusCode,
    timestamp: new Date().toISOString(),
  };
};

// User utilities
export const sanitizeUser = (user: any) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

export const formatUserProfile = (user: any) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
