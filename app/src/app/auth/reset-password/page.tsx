import { AuthLayout } from "@/components/layout/auth-layout";
import { PasswordResetForm } from "@/features/auth/components/password-reset-form";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send you a secure link to reset your password"
    >
      <PasswordResetForm />
    </AuthLayout>
  );
}
