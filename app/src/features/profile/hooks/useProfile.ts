import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import type { Profile, ProfileUpdate, UserWithProfile } from "@/types/database";

const supabase = createClient();

// Profile queries
export const profileKeys = {
  all: ["profiles"] as const,
  profile: (id: string) => [...profileKeys.all, id] as const,
  current: () => [...profileKeys.all, "current"] as const,
};

// Get current user profile
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: async (): Promise<UserWithProfile | null> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(`Failed to fetch profile: ${error.message}`);
      }

      return {
        id: user.id,
        email: user.email!,
        profile,
        last_sign_in_at: user.last_sign_in_at,
      };
    },
    enabled: true,
  });
}

// Update profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: ProfileUpdate): Promise<Profile> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user");
      }

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }

      // Log the profile update
      await supabase.rpc("log_auth_event", {
        p_user_id: user.id,
        p_action: "profile_updated",
        p_details: { updated_fields: Object.keys(updates) },
      });

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });
    },
  });
}

// Upload avatar
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw new Error(`Failed to upload avatar: ${uploadError.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) {
        throw new Error(
          `Failed to update profile with avatar: ${updateError.message}`
        );
      }

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.current() });
    },
  });
}

// Delete account
export function useDeleteAccount() {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user");
      }

      // Log account deletion request
      await supabase.rpc("log_auth_event", {
        p_user_id: user.id,
        p_action: "account_deletion_requested",
      });

      // Note: Actual account deletion should be handled by an admin function
      // This is just a deletion request that needs to be processed
      throw new Error(
        "Account deletion requests must be processed by administrators"
      );
    },
  });
}

// Change password
export function useChangePassword() {
  return useMutation({
    mutationFn: async (newPassword: string): Promise<void> => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(`Failed to change password: ${error.message}`);
      }

      // Log password change
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc("log_auth_event", {
          p_user_id: user.id,
          p_action: "password_changed",
        });
      }
    },
  });
}

// Change email
export function useChangeEmail() {
  return useMutation({
    mutationFn: async (newEmail: string): Promise<void> => {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        throw new Error(`Failed to change email: ${error.message}`);
      }

      // Log email change
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc("log_auth_event", {
          p_user_id: user.id,
          p_action: "email_changed",
          p_details: { new_email: newEmail },
        });
      }
    },
  });
}
