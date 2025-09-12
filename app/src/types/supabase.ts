export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          preferences: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          preferences?: Json | null;
          updated_at?: string;
        };
      };
      user_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_token: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
          expires_at: string | null;
          revoked_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_token?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          expires_at?: string | null;
          revoked_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_token?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          expires_at?: string | null;
          revoked_at?: string | null;
        };
      };
      security_audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          resource: string | null;
          ip_address: string | null;
          user_agent: string | null;
          success: boolean;
          error_details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          resource?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          success?: boolean;
          error_details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          resource?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          success?: boolean;
          error_details?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
