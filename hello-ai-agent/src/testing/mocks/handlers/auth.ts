import { http, HttpResponse } from 'msw';
import { db, persistDb } from '../db';
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateSessionId,
  calculateExpirationDate,
  createCookieHeader,
  isValidEmail,
  isValidPassword,
  createErrorResponse,
  formatUserProfile,
} from '../utils';

// Register endpoint
export const registerHandler = http.post(
  '/api/auth/register',
  async ({ request }) => {
    try {
      const body = (await request.json()) as {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
      };

      const { firstName, lastName, email, password, confirmPassword } = body;

      // Validation
      if (!firstName?.trim()) {
        return HttpResponse.json(
          createErrorResponse('First name is required', 'firstName'),
          { status: 400 }
        );
      }

      if (!lastName?.trim()) {
        return HttpResponse.json(
          createErrorResponse('Last name is required', 'lastName'),
          { status: 400 }
        );
      }

      if (!email?.trim()) {
        return HttpResponse.json(
          createErrorResponse('Email is required', 'email'),
          { status: 400 }
        );
      }

      if (!isValidEmail(email)) {
        return HttpResponse.json(
          createErrorResponse('Please enter a valid email address', 'email'),
          { status: 400 }
        );
      }

      if (!password) {
        return HttpResponse.json(
          createErrorResponse('Password is required', 'password'),
          { status: 400 }
        );
      }

      if (!isValidPassword(password)) {
        return HttpResponse.json(
          createErrorResponse(
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
            'password'
          ),
          { status: 400 }
        );
      }

      if (password !== confirmPassword) {
        return HttpResponse.json(
          createErrorResponse('Passwords do not match', 'confirmPassword'),
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = db.user.findFirst({
        where: { email: { equals: email.toLowerCase() } },
      });

      if (existingUser) {
        return HttpResponse.json(
          createErrorResponse(
            'An account with this email already exists',
            'email'
          ),
          { status: 409 }
        );
      }

      // Create user
      const hashedPassword = await hashPassword(password);

      const newUser = db.user.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'user',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await persistDb('user');

      // Generate session
      const sessionId = generateSessionId();
      const token = generateToken({ userId: newUser.id, sessionId });
      const expiresAt = calculateExpirationDate();

      db.session.create({
        userId: newUser.id,
        token,
        expiresAt,
        createdAt: Date.now(),
        lastActivityAt: Date.now(),
      });

      await persistDb('session');

      // Log registration attempt
      db.loginAttempt.create({
        email: email.toLowerCase(),
        success: true,
        attemptedAt: Date.now(),
      });

      await persistDb('loginAttempt');

      const cookieHeader = createCookieHeader('auth-token', token);

      return HttpResponse.json(
        {
          success: true,
          message: 'Registration successful',
          user: formatUserProfile(newUser),
          token,
        },
        {
          status: 201,
          headers: {
            'Set-Cookie': cookieHeader,
          },
        }
      );
    } catch (error) {
      console.error('Registration error:', error);
      return HttpResponse.json(createErrorResponse('Internal server error'), {
        status: 500,
      });
    }
  }
);

// Login endpoint
export const loginHandler = http.post(
  '/api/auth/login',
  async ({ request }) => {
    try {
      const body = (await request.json()) as {
        email: string;
        password: string;
        rememberMe?: boolean;
      };

      const { email, password, rememberMe = false } = body;

      // Validation
      if (!email?.trim()) {
        return HttpResponse.json(
          createErrorResponse('Email is required', 'email'),
          { status: 400 }
        );
      }

      if (!password) {
        return HttpResponse.json(
          createErrorResponse('Password is required', 'password'),
          { status: 400 }
        );
      }

      // Find user
      const user = db.user.findFirst({
        where: { email: { equals: email.toLowerCase() } },
      });

      // Log attempt
      db.loginAttempt.create({
        email: email.toLowerCase(),
        success: false, // Will update if successful
        attemptedAt: Date.now(),
      });

      if (!user) {
        await persistDb('loginAttempt');
        return HttpResponse.json(
          createErrorResponse('Invalid email or password', 'email'),
          { status: 401 }
        );
      }

      if (!user.isActive) {
        await persistDb('loginAttempt');
        return HttpResponse.json(
          createErrorResponse('Account is deactivated', 'email'),
          { status: 401 }
        );
      }

      // Verify password
      const isValidPassword = await comparePassword(
        password,
        user.password as string
      );

      if (!isValidPassword) {
        await persistDb('loginAttempt');
        return HttpResponse.json(
          createErrorResponse('Invalid email or password', 'password'),
          { status: 401 }
        );
      }

      // Update successful login attempt
      const attempts = db.loginAttempt.getAll();
      const lastAttempt = attempts[attempts.length - 1];
      if (lastAttempt) {
        db.loginAttempt.update({
          where: { id: { equals: lastAttempt.id } },
          data: { success: true },
        });
      }

      // Generate session
      const sessionId = generateSessionId();
      const token = generateToken({ userId: user.id, sessionId });
      const expiresAt = calculateExpirationDate();

      db.session.create({
        userId: user.id,
        token,
        expiresAt,
        createdAt: Date.now(),
        lastActivityAt: Date.now(),
      });

      // Update user last login
      const updatedUser = db.user.update({
        where: { id: { equals: user.id } },
        data: {
          lastLoginAt: Date.now(),
          updatedAt: Date.now(),
        },
      });

      await persistDb('user');
      await persistDb('session');
      await persistDb('loginAttempt');

      const cookieHeader = createCookieHeader('auth-token', token, {
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined, // 30 days if remember me
      });

      return HttpResponse.json(
        {
          success: true,
          message: 'Login successful',
          user: formatUserProfile(updatedUser),
          token,
        },
        {
          status: 200,
          headers: {
            'Set-Cookie': cookieHeader,
          },
        }
      );
    } catch (error) {
      console.error('Login error:', error);
      return HttpResponse.json(createErrorResponse('Internal server error'), {
        status: 500,
      });
    }
  }
);

// Logout endpoint
export const logoutHandler = http.post(
  '/api/auth/logout',
  async ({ request }) => {
    try {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');

      if (!token) {
        return HttpResponse.json(createErrorResponse('No token provided'), {
          status: 401,
        });
      }

      // Find and remove session
      const session = db.session.findFirst({
        where: { token: { equals: token } },
      });

      if (session) {
        db.session.delete({
          where: { id: { equals: session.id } },
        });
        await persistDb('session');
      }

      const clearCookieHeader = createCookieHeader('auth-token', '', {
        maxAge: 0,
      });

      return HttpResponse.json(
        {
          success: true,
          message: 'Logout successful',
        },
        {
          status: 200,
          headers: {
            'Set-Cookie': clearCookieHeader,
          },
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
      return HttpResponse.json(createErrorResponse('Internal server error'), {
        status: 500,
      });
    }
  }
);

// Get current user endpoint
export const getCurrentUserHandler = http.get(
  '/api/auth/me',
  async ({ request }) => {
    try {
      // Get token from authorization header or cookies
      const authHeader = request.headers.get('authorization');
      const cookieHeader = request.headers.get('cookie');

      let token: string | null = null;

      // Try authorization header first
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      }

      // Try cookie if no auth header
      if (!token && cookieHeader) {
        const cookies = cookieHeader.split(';').reduce(
          (acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>
        );
        token = cookies['auth-token'];
      }

      if (!token) {
        return HttpResponse.json(createErrorResponse('No token provided'), {
          status: 401,
        });
      }

      // Find session
      const session = db.session.findFirst({
        where: { token: { equals: token } },
      });

      if (!session) {
        return HttpResponse.json(createErrorResponse('Invalid token'), {
          status: 401,
        });
      }

      // Check if session is expired
      if (new Date() > new Date(session.expiresAt as Date)) {
        db.session.delete({
          where: { id: { equals: session.id } },
        });
        await persistDb('session');
        return HttpResponse.json(createErrorResponse('Token expired'), {
          status: 401,
        });
      }

      // Find user
      const user = db.user.findFirst({
        where: { id: { equals: session.userId } },
      });

      if (!user || !user.isActive) {
        return HttpResponse.json(
          createErrorResponse('User not found or inactive'),
          { status: 401 }
        );
      }

      // Update session activity
      db.session.update({
        where: { id: { equals: session.id } },
        data: { lastActivityAt: Date.now() },
      });

      await persistDb('session');

      return HttpResponse.json(
        {
          success: true,
          user: formatUserProfile(user),
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Get current user error:', error);
      return HttpResponse.json(createErrorResponse('Internal server error'), {
        status: 500,
      });
    }
  }
);

// Refresh token endpoint
export const refreshTokenHandler = http.post(
  '/api/auth/refresh',
  async ({ request }) => {
    try {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');

      if (!token) {
        return HttpResponse.json(createErrorResponse('No token provided'), {
          status: 401,
        });
      }

      // Find session
      const session = db.session.findFirst({
        where: { token: { equals: token } },
      });

      if (!session) {
        return HttpResponse.json(createErrorResponse('Invalid token'), {
          status: 401,
        });
      }

      // Find user
      const user = db.user.findFirst({
        where: { id: { equals: session.userId } },
      });

      if (!user || !user.isActive) {
        return HttpResponse.json(
          createErrorResponse('User not found or inactive'),
          { status: 401 }
        );
      }

      // Generate new token and update session
      const newSessionId = generateSessionId();
      const newToken = generateToken({
        userId: user.id,
        sessionId: newSessionId,
      });
      const newExpiresAt = calculateExpirationDate();

      db.session.update({
        where: { id: { equals: session.id } },
        data: {
          token: newToken,
          expiresAt: newExpiresAt,
          lastActivityAt: Date.now(),
        },
      });

      await persistDb('session');

      const cookieHeader = createCookieHeader('auth-token', newToken);

      return HttpResponse.json(
        {
          success: true,
          message: 'Token refreshed successfully',
          token: newToken,
          user: formatUserProfile(user),
        },
        {
          status: 200,
          headers: {
            'Set-Cookie': cookieHeader,
          },
        }
      );
    } catch (error) {
      console.error('Refresh token error:', error);
      return HttpResponse.json(createErrorResponse('Internal server error'), {
        status: 500,
      });
    }
  }
);

// Debug endpoint to list all users (development only)
export const listUsersHandler = http.get('/api/debug/users', async () => {
  if (process.env.NODE_ENV !== 'development') {
    return HttpResponse.json(
      { error: 'Not available in production' },
      { status: 404 }
    );
  }

  const users = db.user.getAll();

  return HttpResponse.json({
    users: users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
    })),
  });
});

// Admin endpoint to list all users
export const adminListUsersHandler = http.get(
  '/api/auth/users',
  async ({ request }) => {
    try {
      // Get token from authorization header or cookies
      const authHeader = request.headers.get('authorization');
      const cookieHeader = request.headers.get('cookie');

      let token: string | null = null;

      // Try authorization header first
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      }

      // Try cookie if no auth header
      if (!token && cookieHeader) {
        const cookies = cookieHeader.split(';').reduce(
          (acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>
        );
        token = cookies['auth-token'];
      }

      if (!token) {
        return HttpResponse.json(
          createErrorResponse('No authentication token', 'auth'),
          { status: 401 }
        );
      }

      // Find session by token (same as getCurrentUserHandler)
      const session = db.session.findFirst({
        where: { token: { equals: token } },
      });

      if (!session) {
        return HttpResponse.json(createErrorResponse('Invalid token', 'auth'), {
          status: 401,
        });
      }

      // Check if session is expired
      if (new Date() > new Date(session.expiresAt as string)) {
        db.session.delete({
          where: { id: { equals: session.id } },
        });
        await persistDb('session');
        return HttpResponse.json(createErrorResponse('Token expired', 'auth'), {
          status: 401,
        });
      }

      // Find user by session
      const currentUser = db.user.findFirst({
        where: { id: { equals: session.userId } },
      });

      if (!currentUser || !currentUser.isActive) {
        return HttpResponse.json(
          createErrorResponse('User not found or inactive', 'auth'),
          { status: 401 }
        );
      }

      // Check if user is admin
      if (currentUser.role !== 'admin') {
        return HttpResponse.json(
          createErrorResponse('Insufficient permissions', 'auth'),
          { status: 403 }
        );
      }

      // Get all users
      const users = db.user.getAll();

      return HttpResponse.json({
        success: true,
        users: users.map((user) => ({
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
        })),
        message: 'Users retrieved successfully',
      });
    } catch (error) {
      console.error('List users error:', error);
      return HttpResponse.json(createErrorResponse('Internal server error'), {
        status: 500,
      });
    }
  }
);

// Admin endpoint to update user role
export const updateUserRoleHandler = http.patch(
  '/api/auth/users/:userId/role',
  async ({ request, params }) => {
    try {
      const { userId } = params;
      const body = (await request.json()) as { role: string };
      const { role } = body;

      // Get token from authorization header or cookies
      const authHeader = request.headers.get('authorization');
      const cookieHeader = request.headers.get('cookie');

      let token: string | null = null;

      // Try authorization header first
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      }

      // Try cookie if no auth header
      if (!token && cookieHeader) {
        const cookies = cookieHeader.split(';').reduce(
          (acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>
        );
        token = cookies['auth-token'];
      }

      if (!token) {
        return HttpResponse.json(
          createErrorResponse('No authentication token', 'auth'),
          { status: 401 }
        );
      }

      // Find session by token
      const session = db.session.findFirst({
        where: { token: { equals: token } },
      });

      if (!session) {
        return HttpResponse.json(createErrorResponse('Invalid token', 'auth'), {
          status: 401,
        });
      }

      // Check if session is expired
      if (new Date() > new Date(session.expiresAt as string)) {
        db.session.delete({
          where: { id: { equals: session.id } },
        });
        await persistDb('session');
        return HttpResponse.json(createErrorResponse('Token expired', 'auth'), {
          status: 401,
        });
      }

      // Find current user by session
      const currentUser = db.user.findFirst({
        where: { id: { equals: session.userId } },
      });

      if (!currentUser || !currentUser.isActive) {
        return HttpResponse.json(
          createErrorResponse('User not found or inactive', 'auth'),
          { status: 401 }
        );
      }

      // Check if current user is admin
      if (currentUser.role !== 'admin') {
        return HttpResponse.json(
          createErrorResponse('Insufficient permissions', 'auth'),
          { status: 403 }
        );
      }

      // Validate role
      if (!role || !['user', 'admin'].includes(role)) {
        return HttpResponse.json(
          createErrorResponse(
            'Invalid role. Must be "user" or "admin"',
            'role'
          ),
          { status: 400 }
        );
      }

      // Find target user
      const targetUser = db.user.findFirst({
        where: { id: { equals: userId as string } },
      });

      if (!targetUser) {
        return HttpResponse.json(
          createErrorResponse('User not found', 'userId'),
          { status: 404 }
        );
      }

      // Update user role
      const updatedUser = db.user.update({
        where: { id: { equals: userId as string } },
        data: {
          role: role,
          updatedAt: Date.now(),
        },
      });

      if (!updatedUser) {
        return HttpResponse.json(
          createErrorResponse('Failed to update user role'),
          { status: 500 }
        );
      }

      await persistDb('user');

      return HttpResponse.json({
        success: true,
        user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          role: updatedUser.role,
          isActive: updatedUser.isActive,
          emailVerified: updatedUser.emailVerified,
          lastLoginAt: updatedUser.lastLoginAt,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
        message: `User role updated to ${role} successfully`,
      });
    } catch (error) {
      console.error('Update user role error:', error);
      return HttpResponse.json(createErrorResponse('Internal server error'), {
        status: 500,
      });
    }
  }
);

export const authHandlers = [
  registerHandler,
  loginHandler,
  logoutHandler,
  getCurrentUserHandler,
  refreshTokenHandler,
  listUsersHandler,
  adminListUsersHandler,
  updateUserRoleHandler,
];
