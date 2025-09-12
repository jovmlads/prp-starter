"use client";

import { useUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const user = useUser();

  // Redirect if already authenticated
  useEffect(() => {
    if (user.data && !user.isLoading) {
      redirect("/dashboard");
    }
  }, [user.data, user.isLoading]);

  // Show loading state while checking authentication
  if (user.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user.data) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};
