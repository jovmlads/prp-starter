import { ProtectedRoute } from "@/components/ui/protected-route";
import { AccountSettings } from "@/features/profile/components/AccountSettings";

export default function AccountSettingsPage() {
  return (
    <ProtectedRoute>
      <AccountSettings />
    </ProtectedRoute>
  );
}

export const metadata = {
  title: "Account Settings - Trading Dashboard",
  description: "Manage your account settings and security preferences",
};
