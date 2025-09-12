import { AuthLayout } from "@/components/layout/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your trading journey today"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
