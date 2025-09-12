// Database types for Supabase tables
// This should be generated using: npx supabase gen types typescript --project-id YOUR_PROJECT_ID

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
          last_login: string | null;
          is_active: boolean;
          preferences: Record<string, any>;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          is_active?: boolean;
          preferences?: Record<string, any>;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          is_active?: boolean;
          preferences?: Record<string, any>;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      user_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_token: string;
          created_at: string;
          expires_at: string;
          last_activity: string;
          ip_address: string | null;
          user_agent: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_token: string;
          created_at?: string;
          expires_at: string;
          last_activity?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_token?: string;
          created_at?: string;
          expires_at?: string;
          last_activity?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          resource: string | null;
          details: Record<string, any> | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          resource?: string | null;
          details?: Record<string, any> | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          resource?: string | null;
          details?: Record<string, any> | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      log_auth_event: {
        Args: {
          p_user_id: string;
          p_action: string;
          p_details?: Record<string, any> | null;
          p_ip_address?: string | null;
          p_user_agent?: string | null;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Type helpers
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type UserSession = Database["public"]["Tables"]["user_sessions"]["Row"];
export type UserSessionInsert =
  Database["public"]["Tables"]["user_sessions"]["Insert"];
export type UserSessionUpdate =
  Database["public"]["Tables"]["user_sessions"]["Update"];

export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
export type AuditLogInsert =
  Database["public"]["Tables"]["audit_logs"]["Insert"];

// Extended user type combining Auth and Profile
export interface UserWithProfile {
  id: string;
  email: string;
  profile: Profile | null;
  last_sign_in_at?: string;
}

// Session management types
export interface SessionInfo {
  id: string;
  created_at: string;
  expires_at: string;
  last_activity: string;
  ip_address?: string;
  user_agent?: string;
  is_current: boolean;
}

// Audit event types
export type AuditAction =
  | "user_registered"
  | "user_login"
  | "user_logout"
  | "password_changed"
  | "email_changed"
  | "profile_updated"
  | "session_created"
  | "session_expired"
  | "failed_login"
  | "password_reset_requested"
  | "password_reset_completed";
