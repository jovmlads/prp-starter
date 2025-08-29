/**
 * @fileoverview Supabase client configuration for database operations
 * @module lib/supabase
 */

import { createClient } from '@supabase/supabase-js';
import { GenericRecord } from '../types/records';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Use service role key if available (bypasses RLS), otherwise use anon key
const key = supabaseServiceKey || supabaseAnonKey;
console.log(
  '🔧 Supabase using:',
  supabaseServiceKey
    ? 'SERVICE ROLE (bypasses RLS)'
    : 'ANON KEY (requires auth)'
);

export const supabase = createClient(supabaseUrl, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Test database connection
 */
export const testConnection = async (): Promise<{
  connected: boolean;
  error?: any;
}> => {
  try {
    const { error } = await supabase.from('records').select('count').limit(1);

    return { connected: !error, error };
  } catch (error) {
    return { connected: false, error };
  }
};

/**
 * Database types for better TypeScript integration
 */
export interface Database {
  public: {
    Tables: {
      records: {
        Row: GenericRecord;
        Insert: Omit<GenericRecord, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<
          Omit<GenericRecord, 'id' | 'created_at' | 'updated_at'>
        >;
      };
    };
  };
}
