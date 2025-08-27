import { LoginForm } from './LoginForm';

interface LoginPageProps {
  onLoginSuccess?: () => void;
  onForgotPassword?: () => void;
}

export function LoginPage({ onLoginSuccess, onForgotPassword }: LoginPageProps) {
  const handleLoginSuccess = () => {
    // Redirect to dashboard or home page
    console.log('Login successful');
    onLoginSuccess?.();
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page
    console.log('Navigate to forgot password');
    onForgotPassword?.();
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <LoginForm
            onSuccess={handleLoginSuccess}
            onForgotPassword={handleForgotPassword}
          />
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <div className="flex h-full items-center justify-center p-10">
          <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-10 w-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Welcome to Acme Inc.</h2>
              <p className="text-sm text-muted-foreground">
                "This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before."
              </p>
              <div className="pt-4">
                <p className="text-sm font-medium">Sofia Davis</p>
                <p className="text-xs text-muted-foreground">@sofiadavis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
