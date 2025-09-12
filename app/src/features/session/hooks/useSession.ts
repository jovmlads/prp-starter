import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import type { UserSession, SessionInfo } from "@/types/database";

const supabase = createClient();

// Session queries
export const sessionKeys = {
  all: ["sessions"] as const,
  user: (userId: string) => [...sessionKeys.all, userId] as const,
  current: () => [...sessionKeys.all, "current"] as const,
};

// Get current user sessions
export function useUserSessions() {
  return useQuery({
    queryKey: sessionKeys.current(),
    queryFn: async (): Promise<SessionInfo[]> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return [];

      const { data: sessions, error } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("last_activity", { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch sessions: ${error.message}`);
      }

      // Get current session token (from local storage or auth state)
      const currentSession = await supabase.auth.getSession();
      const currentToken = currentSession.data.session?.access_token;

      return sessions.map(
        (session): SessionInfo => ({
          id: session.id,
          created_at: session.created_at,
          expires_at: session.expires_at,
          last_activity: session.last_activity,
          ip_address: session.ip_address || undefined,
          user_agent: session.user_agent || undefined,
          is_current: session.session_token === currentToken,
        })
      );
    },
    enabled: true,
  });
}

// Create new session (called during login)
export function useCreateSession() {
  return useMutation({
    mutationFn: async (sessionData: {
      sessionToken: string;
      expiresAt: string;
      ipAddress?: string;
      userAgent?: string;
    }): Promise<UserSession> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user");
      }

      const { data, error } = await supabase
        .from("user_sessions")
        .insert({
          user_id: user.id,
          session_token: sessionData.sessionToken,
          expires_at: sessionData.expiresAt,
          ip_address: sessionData.ipAddress,
          user_agent: sessionData.userAgent,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create session: ${error.message}`);
      }

      // Log session creation
      await supabase.rpc("log_auth_event", {
        p_user_id: user.id,
        p_action: "session_created",
        p_details: {
          session_id: data.id,
          ip_address: sessionData.ipAddress,
          user_agent: sessionData.userAgent,
        },
        p_ip_address: sessionData.ipAddress,
        p_user_agent: sessionData.userAgent,
      });

      return data;
    },
  });
}

// Revoke a specific session
export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string): Promise<void> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user");
      }

      const { error } = await supabase
        .from("user_sessions")
        .update({ is_active: false })
        .eq("id", sessionId)
        .eq("user_id", user.id); // Ensure user can only revoke their own sessions

      if (error) {
        throw new Error(`Failed to revoke session: ${error.message}`);
      }

      // Log session revocation
      await supabase.rpc("log_auth_event", {
        p_user_id: user.id,
        p_action: "session_revoked",
        p_details: { session_id: sessionId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.current() });
    },
  });
}

// Revoke all other sessions (keep current one)
export function useRevokeAllOtherSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user");
      }

      // Get current session token
      const currentSession = await supabase.auth.getSession();
      const currentToken = currentSession.data.session?.access_token;

      if (!currentToken) {
        throw new Error("No current session found");
      }

      // Revoke all sessions except current one
      const { error } = await supabase
        .from("user_sessions")
        .update({ is_active: false })
        .eq("user_id", user.id)
        .neq("session_token", currentToken);

      if (error) {
        throw new Error(`Failed to revoke sessions: ${error.message}`);
      }

      // Log bulk session revocation
      await supabase.rpc("log_auth_event", {
        p_user_id: user.id,
        p_action: "all_other_sessions_revoked",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.current() });
    },
  });
}

// Update session activity (called on user activity)
export function useUpdateSessionActivity() {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Get current session token
      const currentSession = await supabase.auth.getSession();
      const currentToken = currentSession.data.session?.access_token;

      if (!currentToken) return;

      // Update last activity
      await supabase
        .from("user_sessions")
        .update({ last_activity: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("session_token", currentToken)
        .eq("is_active", true);
    },
  });
}

// Session timeout warning hook
export function useSessionTimeout() {
  return useQuery({
    queryKey: ["session-timeout"],
    queryFn: async (): Promise<{
      timeUntilExpiry: number;
      showWarning: boolean;
    }> => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return { timeUntilExpiry: 0, showWarning: false };
      }

      const expiresAt = new Date(session.expires_at! * 1000);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();

      // Show warning if less than 5 minutes remaining
      const showWarning =
        timeUntilExpiry > 0 && timeUntilExpiry < 5 * 60 * 1000;

      return { timeUntilExpiry, showWarning };
    },
    refetchInterval: 60000, // Check every minute
  });
}

// Extend session (refresh token)
export function useExtendSession() {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      const { error } = await supabase.auth.refreshSession();

      if (error) {
        throw new Error(`Failed to extend session: ${error.message}`);
      }

      // Log session extension
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc("log_auth_event", {
          p_user_id: user.id,
          p_action: "session_extended",
        });
      }
    },
  });
}
