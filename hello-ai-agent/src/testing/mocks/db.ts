import { factory, primaryKey } from '@mswjs/data';
import { nanoid } from 'nanoid';

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
    lastLoginAt: () => new Date(0), // Use epoch date as "null" equivalent
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
    ipAddress: () => '127.0.0.1',
    userAgent: () => 'Test User Agent',
    attemptedAt: Date.now,
  },
};

export const db = factory(models);

// Persistence implementation for dual environment support
const DB_KEY = 'auth-db';
const DB_FILE = 'mocked-auth-db.json';

export const loadDb = async () => {
  if (typeof window === 'undefined') {
    // Node.js environment (testing)
    const { readFile, writeFile } = await import('fs/promises');
    try {
      const data = await readFile(DB_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error: any) {
      if (error?.code === 'ENOENT') {
        const emptyDB = {};
        await writeFile(DB_FILE, JSON.stringify(emptyDB, null, 2));
        return emptyDB;
      }
      console.error('Error loading auth DB:', error);
      return {};
    }
  }
  // Browser environment
  const stored = localStorage.getItem(DB_KEY);

  if (!stored) {
    return {};
  }

  try {
    const parsed = JSON.parse(stored);
    return parsed;
  } catch (error) {
    console.error('[MSW] Error parsing localStorage data:', error);
    return {};
  }
};

export const persistDb = async (model: keyof typeof models) => {
  if (process.env.NODE_ENV === 'test') return;

  try {
    const data = await loadDb();
    data[model] = db[model].getAll();

    const jsonData = JSON.stringify(data, null, 2);

    if (typeof window === 'undefined') {
      const { writeFile } = await import('fs/promises');
      await writeFile(DB_FILE, jsonData);
    } else {
      localStorage.setItem(DB_KEY, jsonData);
    }
  } catch (error) {
    console.error('[MSW] Error persisting database:', error);
  }
};

export const initializeDb = async () => {
  const database = await loadDb();

  // Clear any existing data in MSW models
  Object.keys(models).forEach((modelName) => {
    const model = db[modelName as keyof typeof models];
    model.getAll().forEach((entry) => {
      model.delete({ where: { id: { equals: entry.id } } });
    });
  });

  Object.entries(db).forEach(([key, model]) => {
    const entries = database[key];
    if (entries && Array.isArray(entries)) {
      entries.forEach((entry: any) => {
        model.create(entry);
      });
    }
  });

  // Debug: log current users
  let users = db.user.getAll();

  // Create default admin user if no users exist
  if (users.length === 0) {
    const { hashPassword } = await import('./utils');
    const hashedPassword = await hashPassword('Admin123');

    db.user.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Persist the default user immediately
    await persistDb('user');

    users = db.user.getAll();
  }
};

export const resetDb = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DB_KEY);
  }
};
