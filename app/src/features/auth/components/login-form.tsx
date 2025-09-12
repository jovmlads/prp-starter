"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form/form";
import { useLogin, useUser } from "@/lib/auth";
import {
  loginInputSchema,
  type LoginInput,
} from "@/utils/validation/auth-schemas";

type LoginFormProps = {
  onSuccess?: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const currentUser = useUser();

  const login = useLogin({
    onSuccess: async (user) => {
      console.log("🎉 Login success callback triggered for user:", user?.id);

      // Don't redirect immediately - let React Query update the cache first
      console.log("🔄 Invalidating queries to refresh auth state...");
      await queryClient.invalidateQueries({ queryKey: ["authenticated-user"] });

      // The redirect will happen via useEffect when currentUser.data is available
    },
  });

  // Handle redirect after auth state is confirmed
  useEffect(() => {
    if (currentUser.data && !currentUser.isLoading) {
      console.log("✅ User confirmed in auth state, triggering redirect");
      const destination = redirectTo || "/dashboard";
      console.log("🔄 Redirecting to:", destination);
      router.push(destination);
      onSuccess?.();
    }
  }, [currentUser.data, currentUser.isLoading, redirectTo, router, onSuccess]);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "An error occurred during login";
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            onSubmit={(values: LoginInput) => {
              login.mutate(values);
            }}
            schema={loginInputSchema}
            options={{
              defaultValues: {
                email: "",
                password: "",
                remember: false,
              },
            }}
          >
            {(form) => (
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <FormField
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            autoComplete="email"
                            data-testid="email-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/reset-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormField
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            data-testid="password-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* TODO: Fix TypeScript error with error display
                {login.error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {getErrorMessage(login.error)}
                  </div>
                )}
                */}

                <Button
                  disabled={login.isPending}
                  type="submit"
                  className="w-full"
                  data-testid="login-button"
                >
                  {login.isPending ? "Signing in..." : "Login"}
                </Button>

                <Button variant="outline" className="w-full" type="button">
                  Login with Google
                </Button>

                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href={`/auth/register${
                      redirectTo
                        ? `?redirectTo=${encodeURIComponent(redirectTo)}`
                        : ""
                    }`}
                    className="underline underline-offset-4"
                    data-testid="register-link"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
