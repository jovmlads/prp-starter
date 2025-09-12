"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form/form";
import { resetPassword } from "@/lib/auth";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/utils/validation/auth-schemas";

export const PasswordResetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: ResetPasswordInput) => {
    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(values.email);
      setIsSuccess(true);
    } catch (err) {
      setError((err as Error).message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
          <p className="text-gray-600">
            We&apos;ve sent a password reset link to your email address.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-sm text-green-700">
            If you don&apos;t see the email in your inbox, please check your
            spam folder.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => {
              setIsSuccess(false);
              setError(null);
            }}
            variant="outline"
            className="w-full"
          >
            Send another email
          </Button>

          <Link
            href="/auth/login"
            className="block text-sm text-blue-600 hover:text-blue-500"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Reset your password
        </h2>
        <p className="text-gray-600">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <Form onSubmit={handleSubmit} schema={resetPasswordSchema}>
        {({ formState }) => (
          <>
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      data-testid="email-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              isLoading={isLoading}
              type="submit"
              className="w-full"
              data-testid="reset-button"
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>
          </>
        )}
      </Form>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="text-sm text-blue-600 hover:text-blue-500"
          data-testid="back-to-login"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
};
