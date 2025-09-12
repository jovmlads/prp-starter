import { AuthLayout } from "@/components/layout/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Access your trading dashboard"
    >
      <LoginForm />
    </AuthLayout>
  );
}
