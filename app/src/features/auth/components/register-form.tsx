"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useRegister, useUser } from "@/lib/auth";
import {
  registerInputSchema,
  type RegisterInput,
} from "@/utils/validation/auth-schemas";

type RegisterFormProps = {
  onSuccess?: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const currentUser = useUser();

  const register = useRegister({
    onSuccess: async (user) => {
      console.log(
        "🎉 Registration success callback triggered for user:",
        user?.id
      );

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
    return "An error occurred during registration";
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Enter your information to create your trading account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            onSubmit={(values: RegisterInput) => {
              register.mutate(values);
            }}
            schema={registerInputSchema}
            options={{
              defaultValues: {
                email: "",
                password: "",
                confirmPassword: "",
                firstName: "",
                lastName: "",
                acceptTerms: false,
              },
            }}
          >
            {(form) => (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="First name"
                            autoComplete="given-name"
                            data-testid="first-name-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Last name"
                            autoComplete="family-name"
                            data-testid="last-name-input"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          autoComplete="email"
                          data-testid="email-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a password"
                          autoComplete="new-password"
                          data-testid="password-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground mt-1">
                        Password must contain uppercase, lowercase, number, and
                        special character
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          data-testid="confirm-password-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary focus:ring-ring border-border rounded"
                          data-testid="terms-checkbox"
                          checked={field.value || false}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="underline underline-offset-4 hover:text-primary"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="underline underline-offset-4 hover:text-primary"
                          >
                            Privacy Policy
                          </Link>
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {/* TODO: Fix TypeScript error with error display
                {register.error && (
                  <div className="text-sm text-destructive-foreground bg-destructive/10 p-3 rounded-md border border-destructive/20">
                    {getErrorMessage(register.error)}
                  </div>
                )}
                */}

                <Button
                  disabled={register.isPending}
                  type="submit"
                  className="w-full"
                  data-testid="register-button"
                >
                  {register.isPending
                    ? "Creating account..."
                    : "Create account"}
                </Button>

                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    href={`/auth/login${
                      redirectTo
                        ? `?redirectTo=${encodeURIComponent(redirectTo)}`
                        : ""
                    }`}
                    className="underline underline-offset-4"
                    data-testid="login-link"
                  >
                    Sign in
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
