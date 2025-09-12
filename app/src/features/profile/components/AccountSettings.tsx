"use client";

import { useState } from "react";
import { z } from "zod";
import {
  useProfile,
  useUpdateProfile,
  useChangePassword,
  useChangeEmail,
} from "@/features/profile/hooks/useProfile";
import {
  useUserSessions,
  useRevokeSession,
  useRevokeAllOtherSessions,
} from "@/features/session/hooks/useSession";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form/form";
import { Input } from "@/components/ui/form/input";
import { Button } from "@/components/ui/button";

// Validation schemas
const profileSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name too long"),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

const emailSchema = z.object({
  new_email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required to change email"),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type EmailFormData = z.infer<typeof emailSchema>;

export function AccountSettings() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "sessions"
  >("profile");
  const { data: userProfile } = useProfile();
  const { data: sessions } = useUserSessions();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const changeEmail = useChangeEmail();
  const revokeSession = useRevokeSession();
  const revokeAllOther = useRevokeAllOtherSessions();

  const onUpdateProfile = (data: ProfileFormData) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        alert("Profile updated successfully!");
      },
    });
  };

  const onChangePassword = (data: PasswordFormData) => {
    changePassword.mutate(data.new_password, {
      onSuccess: () => {
        alert("Password changed successfully!");
      },
    });
  };

  const onChangeEmail = (data: EmailFormData) => {
    changeEmail.mutate(data.new_email, {
      onSuccess: () => {
        alert("Confirmation email sent to your new address!");
      },
    });
  };

  const handleRevokeSession = (sessionId: string) => {
    if (confirm("Are you sure you want to revoke this session?")) {
      revokeSession.mutate(sessionId);
    }
  };

  const handleRevokeAllOther = () => {
    if (
      confirm(
        "Are you sure you want to revoke all other sessions? This will log you out from all other devices."
      )
    ) {
      revokeAllOther.mutate();
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "sessions", label: "Sessions", icon: "📱" },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto p-6" data-testid="account-settings">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Account Settings
      </h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Profile Information
            </h2>
            <Form
              schema={profileSchema}
              onSubmit={onUpdateProfile}
              options={{
                defaultValues: {
                  full_name: userProfile?.profile?.full_name || "",
                  phone: userProfile?.profile?.phone || "",
                },
              }}
            >
              {(form) => (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          value={userProfile?.email || ""}
                          disabled
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500">
                        Email cannot be changed here. Use the Security tab.
                      </p>
                    </FormItem>

                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your full name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your phone number"
                              type="tel"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      type="submit"
                      isLoading={updateProfile.isPending}
                      data-testid="update-profile-button"
                    >
                      Update Profile
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-8">
          {/* Change Password */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Change Password
            </h2>
            <Form
              schema={passwordSchema}
              onSubmit={onChangePassword}
              options={{
                defaultValues: {
                  current_password: "",
                  new_password: "",
                  confirm_password: "",
                },
              }}
            >
              {(form) => (
                <>
                  <div className="space-y-4 max-w-md">
                    <FormField
                      control={form.control}
                      name="current_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Enter current password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="new_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Enter new password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Confirm new password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      type="submit"
                      isLoading={changePassword.isPending}
                      data-testid="change-password-button"
                    >
                      Change Password
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>

          {/* Change Email */}
          <div className="border-t pt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Change Email Address
            </h2>
            <Form
              schema={emailSchema}
              onSubmit={onChangeEmail}
              options={{ defaultValues: { new_email: "", password: "" } }}
            >
              {(form) => (
                <>
                  <div className="space-y-4 max-w-md">
                    <FormItem>
                      <FormLabel>Current Email</FormLabel>
                      <FormControl>
                        <Input
                          value={userProfile?.email || ""}
                          disabled
                          className="bg-gray-50"
                        />
                      </FormControl>
                    </FormItem>

                    <FormField
                      control={form.control}
                      name="new_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Email Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter new email address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Enter your password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      type="submit"
                      isLoading={changeEmail.isPending}
                      data-testid="change-email-button"
                    >
                      Send Confirmation Email
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>
        </div>
      )}

      {/* Sessions Tab */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Active Sessions
            </h2>
            <Button
              variant="outline"
              onClick={handleRevokeAllOther}
              isLoading={revokeAllOther.isPending}
              data-testid="revoke-all-sessions-button"
            >
              Revoke All Other Sessions
            </Button>
          </div>

          <div className="space-y-4">
            {sessions?.map((session) => (
              <div
                key={session.id}
                className="border border-gray-200 rounded-lg p-4"
                data-testid={`session-${session.id}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">
                        {session.user_agent || "Unknown Device"}
                      </h3>
                      {session.is_current && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Current Session
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500 space-y-1">
                      <p>IP Address: {session.ip_address || "Unknown"}</p>
                      <p>
                        Created: {new Date(session.created_at).toLocaleString()}
                      </p>
                      <p>
                        Last Activity:{" "}
                        {new Date(session.last_activity).toLocaleString()}
                      </p>
                      <p>
                        Expires: {new Date(session.expires_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {!session.is_current && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      isLoading={revokeSession.isPending}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {(!sessions || sessions.length === 0) && (
              <p className="text-gray-500 text-center py-8">
                No active sessions found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
