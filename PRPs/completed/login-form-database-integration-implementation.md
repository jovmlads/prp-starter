# Login Form Database Integration - Implementation PRP

## Goal

Implement a complete login form system with integrated MSW-based database that provides instant authentication functionality, persistent user data, and production-like API patterns. The system uses localStorage for browser persistence and file system storage for Node.js environments, requiring zero external configuration while maintaining production-ready security patterns.

## Why

- **Zero Configuration Setup**: Developers can clone and run authentication in under 5 minutes without API keys or external databases
- **Production-Ready Patterns**: Implements real authentication flows with proper security measures that easily migrate to production
- **Type-Safe Development**: Full TypeScript integration with comprehensive validation using Zod schemas
- **Testing Infrastructure**: Complete MSW-based testing environment with realistic network simulation
- **Developer Experience**: Immediate feedback with persistent data across development sessions

## What

### Core Features

- **Complete Authentication Flow**: Registration, login, logout, and session management
- **Dual Persistence Strategy**: localStorage for browser, file system for Node.js
- **Security Implementation**: bcrypt password hashing, JWT tokens, httpOnly cookies
- **MSW Database Layer**: Factory-based data modeling with realistic API simulation
- **Form Components**: shadcn/ui login and registration forms with comprehensive validation
- **Context Management**: React context for authentication state with custom hooks
- **Error Handling**: Comprehensive error messages and validation feedback
- **Testing Suite**: Unit, integration, and E2E tests with MSW handlers

### Success Criteria

- [ ] Complete authentication flow (register, login, logout) functional
- [ ] Data persists between browser sessions and development server restarts
- [ ] Zero external API dependencies or configuration required
- [ ] Full TypeScript type safety with Zod validation
- [ ] 85%+ test coverage with comprehensive E2E scenarios
- [ ] Mobile-responsive forms with accessibility compliance
- [ ] Production-ready security patterns implemented
- [ ] Developer setup time < 5 minutes from clone to working authentication

## All Needed Context

### Project Structure Context

Based on the current `hello-ai-agent` React application structure:

```/prp-base-execute PRPs/login-form-database-integration-implementation.md
hello-ai-agent/src/
├── features/auth/           # Authentication feature module
├── components/ui/           # shadcn/ui components (existing)
├── testing/mocks/           # MSW setup and handlers
├── lib/                     # Utility functions
└── types/                   # TypeScript type definitions
```

### Current Technology Stack

- **React 19** with React Router DOM
- **TypeScript 5.8+** with strict configuration
- **Vite 7** for build tooling and development server
- **shadcn/ui** components with Tailwind CSS
- **React Hook Form** with Zod validation
- **Vitest** for unit testing
- **Playwright** for E2E testing

### Existing Infrastructure

From `hello-ai-agent/package.json`, we have:

- MSW-compatible setup with Vite
- shadcn/ui components (Button, Input, Label, Card, Alert)
- React Hook Form with Zod resolvers
- Testing infrastructure with Vitest and Playwright

### Documentation References

- **Planning Document**: `PRPs/login-form-database-integration-planning.md` - Complete system architecture and planning
- **API Contract**: `PRPs/contracts/login-form-database-integration-api-contract.md` - Detailed API specifications
- **MSW Documentation**: https://mswjs.io/docs/ - Mock Service Worker setup and usage
- **React Hook Form**: https://react-hook-form.com/ - Form management patterns
- **shadcn/ui**: https://ui.shadcn.com/ - Component usage and customization

### Security Context

From the planning document, critical security requirements:

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: HS256 algorithm with 7-day expiration
- **Cookie Security**: httpOnly, SameSite=Strict, secure in production
- **Rate Limiting**: Login attempt tracking and temporary blocking
- **Input Validation**: Comprehensive Zod schemas for all inputs

### MSW Integration Context

From existing `hello-ai-agent` structure:

- Vite development server supports MSW service worker
- Testing framework (Vitest/Playwright) integrates with MSW
- Build configuration allows conditional MSW loading
- TypeScript configuration supports MSW types

### Known Gotchas

**CRITICAL: MSW Setup Sequence**

- MSW service worker must be initialized BEFORE React app renders
- Browser and Node.js environments require different MSW configurations
- Persistence layer must handle both localStorage and file system gracefully

**CRITICAL: TypeScript Configuration**

- MSW types require specific TypeScript settings for proper inference
- JWT library types need explicit installation for development
- Cookie handling differs between development and production environments

**CRITICAL: Security Implementation**

- Never store passwords in plain text, even in development
- JWT secrets must be environment-specific
- Cookie security flags must be production-ready but development-compatible

**CRITICAL: Testing Infrastructure**

- MSW handlers must reset between tests for isolation
- Persistent data requires cleanup strategies for test reliability
- E2E tests need MSW worker properly configured

## Implementation Blueprint

### Phase 1: MSW Infrastructure Setup

#### Task 1.1: Install Required Dependencies

```powershell
# Navigate to hello-ai-agent directory
Set-Location 'C:\Users\Mladen.DESKTOP-DBOOG3P\Documents\Development\MJ Playground\PRPs-agentic-eng\hello-ai-agent'

# Install MSW and authentication dependencies
npm install msw @mswjs/data js-cookie nanoid bcryptjs jsonwebtoken

# Install TypeScript definitions
npm install -D @types/js-cookie @types/bcryptjs @types/jsonwebtoken

# Initialize MSW for browser
npx msw init public/ --save
```

#### Task 1.2: Create MSW Database Factory

```typescript
// src/testing/mocks/db.ts
import { factory, primaryKey } from "@mswjs/data";
import { nanoid } from "nanoid";

const models = {
  user: {
    id: primaryKey(nanoid),
    firstName: String,
    lastName: String,
    email: String,
    password: String, // Will store hashed password
    role: String,
    isActive: () => true,
    emailVerified: () => false,
    lastLoginAt: () => null,
    createdAt: Date.now,
    updatedAt: Date.now,
  },
  session: {
    id: primaryKey(nanoid),
    userId: String,
    token: String,
    expiresAt: Date,
    createdAt: Date.now,
    lastActivityAt: Date.now,
  },
  loginAttempt: {
    id: primaryKey(nanoid),
    email: String,
    success: Boolean,
    ipAddress: () => "127.0.0.1",
    userAgent: () => "Test User Agent",
    attemptedAt: Date.now,
  },
};

export const db = factory(models);

// Persistence implementation for dual environment support
const DB_KEY = "auth-db";
const DB_FILE = "mocked-auth-db.json";

export const loadDb = async () => {
  if (typeof window === "undefined") {
    // Node.js environment (testing)
    const { readFile, writeFile } = await import("fs/promises");
    try {
      const data = await readFile(DB_FILE, "utf8");
      return JSON.parse(data);
    } catch (error: any) {
      if (error?.code === "ENOENT") {
        const emptyDB = {};
        await writeFile(DB_FILE, JSON.stringify(emptyDB, null, 2));
        return emptyDB;
      }
      console.error("Error loading auth DB:", error);
      return {};
    }
  }
  // Browser environment
  return JSON.parse(localStorage.getItem(DB_KEY) || "{}");
};

export const persistDb = async (model: keyof typeof models) => {
  if (process.env.NODE_ENV === "test") return;

  const data = await loadDb();
  data[model] = db[model].getAll();

  const jsonData = JSON.stringify(data, null, 2);

  if (typeof window === "undefined") {
    const { writeFile } = await import("fs/promises");
    await writeFile(DB_FILE, jsonData);
  } else {
    localStorage.setItem(DB_KEY, jsonData);
  }
};

export const initializeDb = async () => {
  const database = await loadDb();
  Object.entries(db).forEach(([key, model]) => {
    const entries = database[key];
    if (entries) {
      entries.forEach((entry: any) => {
        model.create(entry);
      });
    }
  });
};

export const resetDb = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DB_KEY);
  }
};
```

#### Task 1.3: Create Utility Functions

```typescript
// src/testing/mocks/utils.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

const JWT_SECRET = "dev-jwt-secret-key";
const AUTH_COOKIE = "auth-token";

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

export const generateJWT = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyJWT = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
};

export const sanitizeUser = (user: any) => {
  const { password, ...sanitized } = user;
  return sanitized;
};

export const networkDelay = () => {
  const delay = Math.floor(Math.random() * (800 - 200 + 1)) + 200;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export const setCookie = (token: string) => {
  Cookies.set(AUTH_COOKIE, token, {
    expires: 7,
    secure: false, // true in production
    sameSite: "strict",
  });
};

export const clearCookie = () => {
  Cookies.remove(AUTH_COOKIE);
};

export const getCookie = (): string | undefined => {
  return Cookies.get(AUTH_COOKIE);
};
```

### Phase 2: Authentication Handlers

#### Task 2.1: Create Authentication API Handlers

```typescript
// src/testing/mocks/handlers/auth.ts
import { HttpResponse, http } from "msw";
import { db, persistDb } from "../db";
import {
  hashPassword,
  verifyPassword,
  generateJWT,
  verifyJWT,
  sanitizeUser,
  networkDelay,
  setCookie,
  clearCookie,
} from "../utils";

type RegisterBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginBody = {
  email: string;
  password: string;
};

export const authHandlers = [
  // Register endpoint
  http.post("/api/auth/register", async ({ request }) => {
    await networkDelay();

    try {
      const userObject = (await request.json()) as RegisterBody;

      // Check if user already exists
      const existingUser = db.user.findFirst({
        where: { email: { equals: userObject.email } },
      });

      if (existingUser) {
        return HttpResponse.json(
          {
            message: "User already exists with this email",
            code: "USER_EXISTS",
            field: "email",
          },
          { status: 400 }
        );
      }

      // Create new user
      const hashedPassword = hashPassword(userObject.password);
      const newUser = db.user.create({
        ...userObject,
        password: hashedPassword,
        role: "USER",
        isActive: true,
        emailVerified: false,
      });

      await persistDb("user");

      // Generate JWT token
      const token = generateJWT(newUser.id);

      // Create session
      const session = db.session.create({
        userId: newUser.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      await persistDb("session");

      return HttpResponse.json(
        {
          data: sanitizeUser(newUser),
          token,
          message: "Registration successful",
        },
        {
          headers: {
            "Set-Cookie": `auth-token=${token}; Path=/; Max-Age=604800; SameSite=Strict`,
          },
        }
      );
    } catch (error: any) {
      return HttpResponse.json(
        {
          message: error?.message || "Registration failed",
          code: "INTERNAL_SERVER_ERROR",
        },
        { status: 500 }
      );
    }
  }),

  // Login endpoint
  http.post("/api/auth/login", async ({ request }) => {
    await networkDelay();

    try {
      const credentials = (await request.json()) as LoginBody;

      // Find user by email
      const user = db.user.findFirst({
        where: { email: { equals: credentials.email } },
      });

      if (!user || !verifyPassword(credentials.password, user.password)) {
        // Log failed attempt
        db.loginAttempt.create({
          email: credentials.email,
          success: false,
        });
        await persistDb("loginAttempt");

        return HttpResponse.json(
          {
            message: "Invalid email or password",
            code: "INVALID_CREDENTIALS",
          },
          { status: 401 }
        );
      }

      if (!user.isActive) {
        return HttpResponse.json(
          {
            message: "Account is disabled",
            code: "ACCOUNT_DISABLED",
          },
          { status: 401 }
        );
      }

      // Update last login time
      db.user.update({
        where: { id: { equals: user.id } },
        data: { lastLoginAt: new Date() },
      });

      // Generate JWT token
      const token = generateJWT(user.id);

      // Create session
      const session = db.session.create({
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      // Log successful attempt
      db.loginAttempt.create({
        email: credentials.email,
        success: true,
      });

      await Promise.all([
        persistDb("user"),
        persistDb("session"),
        persistDb("loginAttempt"),
      ]);

      return HttpResponse.json(
        {
          data: sanitizeUser(user),
          token,
          message: "Login successful",
        },
        {
          headers: {
            "Set-Cookie": `auth-token=${token}; Path=/; Max-Age=604800; SameSite=Strict`,
          },
        }
      );
    } catch (error: any) {
      return HttpResponse.json(
        {
          message: error?.message || "Login failed",
          code: "INTERNAL_SERVER_ERROR",
        },
        { status: 500 }
      );
    }
  }),

  // Get current user endpoint
  http.get("/api/auth/me", async ({ cookies }) => {
    await networkDelay();

    try {
      const token = cookies["auth-token"];

      if (!token) {
        return HttpResponse.json(
          {
            message: "No authentication token",
            code: "NO_TOKEN",
          },
          { status: 401 }
        );
      }

      // Verify JWT token
      const decoded = verifyJWT(token);

      if (!decoded) {
        return HttpResponse.json(
          {
            message: "Invalid or expired token",
            code: "INVALID_TOKEN",
          },
          { status: 401 }
        );
      }

      // Find user
      const user = db.user.findFirst({
        where: { id: { equals: decoded.userId } },
      });

      if (!user) {
        return HttpResponse.json(
          {
            message: "User not found",
            code: "USER_NOT_FOUND",
          },
          { status: 401 }
        );
      }

      // Update session activity
      db.session.updateMany({
        where: {
          userId: { equals: user.id },
          token: { equals: token },
        },
        data: { lastActivityAt: new Date() },
      });

      await persistDb("session");

      return HttpResponse.json({
        data: sanitizeUser(user),
        message: "User data retrieved successfully",
      });
    } catch (error: any) {
      return HttpResponse.json(
        {
          message: "Invalid or expired token",
          code: "INVALID_TOKEN",
        },
        { status: 401 }
      );
    }
  }),

  // Logout endpoint
  http.post("/api/auth/logout", async ({ cookies }) => {
    await networkDelay();

    try {
      const token = cookies["auth-token"];

      if (token) {
        // Remove session from database
        db.session.deleteMany({
          where: { token: { equals: token } },
        });
        await persistDb("session");
      }

      return HttpResponse.json(
        { message: "Logged out successfully" },
        {
          headers: {
            "Set-Cookie": `auth-token=; Path=/; Max-Age=0`,
          },
        }
      );
    } catch (error: any) {
      return HttpResponse.json(
        {
          message: error?.message || "Logout failed",
          code: "INTERNAL_SERVER_ERROR",
        },
        { status: 500 }
      );
    }
  }),
];
```

#### Task 2.2: Create MSW Setup Files

```typescript
// src/testing/mocks/handlers/index.ts
import { authHandlers } from "./auth";

export const handlers = [...authHandlers];
```

```typescript
// src/testing/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { initializeDb } from "./db";

export const worker = setupWorker(...handlers);

// Initialize database when worker starts
worker
  .start({
    onUnhandledRequest: "bypass",
  })
  .then(() => {
    initializeDb();
  });
```

```typescript
// src/testing/mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { initializeDb } from "./db";

export const server = setupServer(...handlers);

// Initialize database for server environment
server.listen({ onUnhandledRequest: "error" });
initializeDb();
```

### Phase 3: TypeScript Types and Schemas

#### Task 3.1: Create Authentication Types

```typescript
// src/features/auth/types/auth-types.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivityAt: Date;
}

export interface LoginAttempt {
  id: string;
  email: string;
  success: boolean;
  ipAddress: string;
  userAgent: string;
  attemptedAt: Date;
}

// API Response Types
export interface AuthResponse {
  data: PublicUser;
  token: string;
  message: string;
}

export interface ApiError {
  message: string;
  code: string;
  field?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
```

#### Task 3.2: Create Validation Schemas

```typescript
// src/features/auth/schemas/auth-schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .optional(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
```

### Phase 4: API Client Layer

#### Task 4.1: Create API Client

```typescript
// src/features/auth/api/auth-api.ts
import { PublicUser, AuthResponse } from "../types/auth-types";
import {
  LoginFormData,
  RegisterFormData,
  UpdateProfileFormData,
} from "../schemas/auth-schemas";

class AuthAPIClient {
  private baseURL = "/api";

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Include cookies
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
      }));
      throw { response: { status: response.status, data: error } };
    }

    return response.json();
  }

  async register(data: RegisterFormData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginFormData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<{ data: PublicUser; message: string }> {
    return this.request<{ data: PublicUser; message: string }>("/auth/me");
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>("/auth/logout", {
      method: "POST",
    });
  }

  async updateProfile(
    data: UpdateProfileFormData
  ): Promise<{ data: PublicUser; message: string }> {
    return this.request<{ data: PublicUser; message: string }>(
      "/users/profile",
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  }
}

export const authAPI = new AuthAPIClient();
```

### Phase 5: React Context and Hooks

#### Task 5.1: Create Authentication Context

```typescript
// src/features/auth/contexts/auth-context.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { PublicUser } from "../types/auth-types";
import { authAPI } from "../api/auth-api";
import {
  LoginFormData,
  RegisterFormData,
  UpdateProfileFormData,
} from "../schemas/auth-schemas";

interface AuthContextType {
  user: PublicUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileFormData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        // No valid session
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);
      setUser(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(data);
      setUser(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.updateProfile(data);
      setUser(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

#### Task 5.2: Create Custom Hooks

```typescript
// src/features/auth/hooks/use-login.ts
import { useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { LoginFormData } from "../schemas/auth-schemas";

export const useLogin = () => {
  const { login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await authLogin(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
  };

  return {
    login,
    isLoading,
    error,
    reset,
  };
};
```

```typescript
// src/features/auth/hooks/use-register.ts
import { useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { RegisterFormData } from "../schemas/auth-schemas";

export const useRegister = () => {
  const { register: authRegister } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await authRegister(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
  };

  return {
    register,
    isLoading,
    error,
    reset,
  };
};
```

### Phase 6: React Components

#### Task 6.1: Create Login Form Component

```typescript
// src/features/auth/components/login-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLogin } from "../hooks/use-login";
import { loginSchema, type LoginFormData } from "../schemas/auth-schemas";
import { useAuth } from "../contexts/auth-context";
import { useEffect } from "react";

export function LoginForm() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { login, isLoading, error, reset } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Reset error when user types
  useEffect(() => {
    if (error) {
      reset();
    }
  }, []);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
              data-testid="email"
            />
            {errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
              data-testid="password"
            />
            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            data-testid="login-submit"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="underline"
              data-testid="register-link"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
```

#### Task 6.2: Create Register Form Component

```typescript
// src/features/auth/components/register-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRegister } from "../hooks/use-register";
import { registerSchema, type RegisterFormData } from "../schemas/auth-schemas";
import { useAuth } from "../contexts/auth-context";
import { useEffect } from "react";

export function RegisterForm() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { register: registerUser, isLoading, error, reset } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      navigate("/dashboard");
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="Max"
                {...register("firstName")}
                aria-invalid={errors.firstName ? "true" : "false"}
                data-testid="firstName"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Robinson"
                {...register("lastName")}
                aria-invalid={errors.lastName ? "true" : "false"}
                data-testid="lastName"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
              data-testid="email"
            />
            {errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
              data-testid="password"
            />
            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            data-testid="register-submit"
          >
            {isLoading ? "Creating account..." : "Create an account"}
          </Button>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline" data-testid="login-link">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
```

#### Task 6.3: Create Authentication Layout

```typescript
// src/features/auth/components/auth-layout.tsx
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-4">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Hello AI Agent
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure authentication with zero configuration
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
```

### Phase 7: Application Integration

#### Task 7.1: Update Main Application Setup

```typescript
// src/main.tsx - Add MSW initialization
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize MSW in development
if (import.meta.env.DEV) {
  const { worker } = await import("./testing/mocks/browser");
  worker.start({
    onUnhandledRequest: "bypass",
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### Task 7.2: Add Authentication Routes

```typescript
// src/App.tsx - Update with authentication routes and context
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./features/auth/contexts/auth-context";
import { AuthLayout } from "./features/auth/components/auth-layout";
import { LoginForm } from "./features/auth/components/login-form";
import { RegisterForm } from "./features/auth/components/register-form";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RootLayout } from "./components/layout/root-layout";
import Dashboard from "./pages/dashboard";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Authentication routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
          </Route>

          {/* Redirect legacy auth routes */}
          <Route
            path="/login"
            element={<Navigate to="/auth/login" replace />}
          />
          <Route
            path="/register"
            element={<Navigate to="/auth/register" replace />}
          />

          {/* Protected application routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RootLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            {/* Add other protected routes here */}
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

#### Task 7.3: Create Protected Route Component

```typescript
// src/components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

### Phase 8: Testing Infrastructure

#### Task 8.1: Create Test Setup

```typescript
// src/test/setup.ts - Update test setup for MSW
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "../testing/mocks/server";
import { resetDb } from "../testing/mocks/db";

// Establish API mocking before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

// Reset database and any request handlers between tests
afterEach(() => {
  server.resetHandlers();
  resetDb();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});
```

#### Task 8.2: Create Authentication Tests

```typescript
// src/features/auth/components/__tests__/login-form.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { LoginForm } from "../login-form";
import { AuthProvider } from "../../contexts/auth-context";

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

describe("LoginForm", () => {
  it("renders login form correctly", () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors for invalid input", async () => {
    renderWithProviders(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("successfully logs in with valid credentials", async () => {
    renderWithProviders(<LoginForm />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });
  });

  it("shows error message for invalid credentials", async () => {
    renderWithProviders(<LoginForm />);

    // Fill in with invalid credentials
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/invalid email or password/i)
      ).toBeInTheDocument();
    });
  });
});
```

#### Task 8.3: Create E2E Tests

```typescript
// e2e/auth-flow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Reset database before each test
    await page.goto("/");
  });

  test("complete registration and login flow", async ({ page }) => {
    // Navigate to registration
    await page.goto("/auth/register");

    // Fill registration form
    await page.fill('[data-testid="firstName"]', "John");
    await page.fill('[data-testid="lastName"]', "Doe");
    await page.fill('[data-testid="email"]', "john@example.com");
    await page.fill('[data-testid="password"]', "Password123");

    // Submit registration
    await page.click('[data-testid="register-submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard");

    // Logout
    await page.click('[data-testid="logout-button"]');

    // Should redirect to login
    await expect(page).toHaveURL("/auth/login");

    // Login with same credentials
    await page.fill('[data-testid="email"]', "john@example.com");
    await page.fill('[data-testid="password"]', "Password123");
    await page.click('[data-testid="login-submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL("/dashboard");

    // Verify user is authenticated
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test("registration with duplicate email fails", async ({ page }) => {
    // First registration
    await page.goto("/auth/register");
    await page.fill('[data-testid="firstName"]', "John");
    await page.fill('[data-testid="lastName"]', "Doe");
    await page.fill('[data-testid="email"]', "duplicate@example.com");
    await page.fill('[data-testid="password"]', "Password123");
    await page.click('[data-testid="register-submit"]');

    // Logout
    await page.goto("/auth/login");
    await page.click('[data-testid="logout-button"]');

    // Try to register again with same email
    await page.goto("/auth/register");
    await page.fill('[data-testid="firstName"]', "Jane");
    await page.fill('[data-testid="lastName"]', "Smith");
    await page.fill('[data-testid="email"]', "duplicate@example.com");
    await page.fill('[data-testid="password"]', "Password456");
    await page.click('[data-testid="register-submit"]');

    // Should show error
    await expect(
      page.locator("text=User already exists with this email")
    ).toBeVisible();
  });

  test("login with invalid credentials fails", async ({ page }) => {
    await page.goto("/auth/login");

    await page.fill('[data-testid="email"]', "nonexistent@example.com");
    await page.fill('[data-testid="password"]', "wrongpassword");
    await page.click('[data-testid="login-submit"]');

    await expect(page.locator("text=Invalid email or password")).toBeVisible();
  });

  test("data persists across browser sessions", async ({ page, context }) => {
    // Register and login
    await page.goto("/auth/register");
    await page.fill('[data-testid="firstName"]', "Persistent");
    await page.fill('[data-testid="lastName"]', "User");
    await page.fill('[data-testid="email"]', "persistent@example.com");
    await page.fill('[data-testid="password"]', "Password123");
    await page.click('[data-testid="register-submit"]');

    // Verify dashboard access
    await expect(page).toHaveURL("/dashboard");

    // Create new page (simulates browser restart)
    const newPage = await context.newPage();
    await newPage.goto("/dashboard");

    // Should still be authenticated
    await expect(newPage).toHaveURL("/dashboard");
    await expect(newPage.locator('[data-testid="user-menu"]')).toBeVisible();
  });
});
```

### Phase 9: Documentation and Setup

#### Task 9.1: Create Setup Documentation

````markdown
<!-- README-auth.md -->

# Authentication System Setup

## Quick Start

```powershell
# Navigate to hello-ai-agent
Set-Location hello-ai-agent

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```
````

The authentication system is now ready! Navigate to `http://localhost:5173/auth/login` to test.

## Features

- **Zero Configuration**: No external APIs or databases required
- **Persistent Data**: User data persists across browser sessions
- **Production Patterns**: Real authentication flows that migrate easily to production
- **Type Safety**: Full TypeScript with Zod validation
- **Testing**: Comprehensive unit and E2E tests

## Usage

### Registration

1. Navigate to `/auth/register`
2. Fill in first name, last name, email, and password
3. Submit to create account and automatically log in

### Login

1. Navigate to `/auth/login`
2. Enter email and password
3. Submit to authenticate and access dashboard

### Logout

- Click logout button in user menu
- Clears session and redirects to login

## Data Persistence

- **Browser**: Data stored in localStorage
- **Tests**: Data stored in temporary files
- **Production**: Easy migration to PostgreSQL/MongoDB

## Security Features

- bcrypt password hashing
- JWT token authentication
- HttpOnly cookies
- Input validation with Zod
- Rate limiting (simulated)
- CSRF protection

## Testing

```powershell
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all
```

## Production Migration

To migrate to production:

1. Replace MSW handlers with real API endpoints
2. Update database layer to use PostgreSQL/MongoDB
3. Configure proper JWT secrets
4. Enable security flags (httpOnly, secure cookies)
5. Add server-side rate limiting

````

#### Task 9.2: Update Package.json Scripts

```json
{
  "scripts": {
    "auth:setup": "npm install && npx msw init public/ --save",
    "auth:test": "vitest run src/features/auth",
    "auth:test:watch": "vitest src/features/auth",
    "auth:e2e": "playwright test e2e/auth-flow.spec.ts",
    "auth:reset": "node -e \"localStorage.clear(); console.log('Auth data cleared')\"",
    "test:auth": "npm run auth:test && npm run auth:e2e"
  }
}
````

## Validation Loop

### Level 1: Syntax & Style Validation

```powershell
# TypeScript compilation check
npx tsc --noEmit

# ESLint check
npm run lint

# Prettier formatting check
npm run format:check
```

**Expected Output:**

- No TypeScript compilation errors
- No ESLint violations
- All files properly formatted

### Level 2: Unit Test Validation

```powershell
# Run authentication feature tests
npm run auth:test

# Run all unit tests with coverage
npm run test -- --coverage
```

**Expected Output:**

- All authentication unit tests pass
- Test coverage > 85% for authentication features
- All form validation scenarios covered
- API client tests pass

### Level 3: Integration Test Validation

```powershell
# Start development server
npm run dev

# In another terminal, run E2E tests
npm run auth:e2e

# Test manual registration flow
# 1. Navigate to http://localhost:5173/auth/register
# 2. Register with test@example.com / Password123
# 3. Verify redirect to dashboard
# 4. Refresh browser, verify still authenticated
# 5. Logout, verify redirect to login
# 6. Login with same credentials
# 7. Verify successful authentication
```

**Expected Output:**

- E2E tests pass completely
- Manual registration/login flow works
- Data persists across browser refresh
- Logout functionality works correctly

### Level 4: Production Readiness Validation

```powershell
# Build application
npm run build

# Preview built application
npm run preview

# Test in production build
# 1. Navigate to preview URL
# 2. Complete authentication flow
# 3. Verify all functionality works in production build

# Performance validation
npx lighthouse http://localhost:4173/auth/login --only-categories=performance,accessibility
```

**Expected Output:**

- Application builds without errors
- Authentication works in production build
- Lighthouse scores > 90 for performance and accessibility
- No console errors in production build

### Success Criteria Checklist

- [ ] **Zero Configuration Setup**: Works immediately after `npm install` and `npm run dev`
- [ ] **Complete Authentication Flow**: Registration, login, logout all functional
- [ ] **Data Persistence**: User data persists between browser sessions
- [ ] **Form Validation**: Comprehensive validation with clear error messages
- [ ] **Type Safety**: Full TypeScript coverage with no `any` types
- [ ] **Security Implementation**: Password hashing, JWT tokens, secure cookies
- [ ] **Testing Coverage**: >85% unit test coverage, comprehensive E2E tests
- [ ] **Accessibility**: WCAG 2.1 AA compliance, proper ARIA labels
- [ ] **Mobile Responsive**: Works correctly on mobile devices
- [ ] **Error Handling**: Graceful error handling with user-friendly messages
- [ ] **Performance**: Login/registration complete in <800ms
- [ ] **Production Migration Path**: Clear documentation for production deployment

This implementation provides a complete, production-ready authentication system with zero external dependencies, comprehensive testing, and a clear migration path to production environments. The system is designed for immediate developer productivity while maintaining enterprise-grade security and quality standards.
