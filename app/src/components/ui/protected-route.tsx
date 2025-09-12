"use client";

import { redirect, usePathname } from "next/navigation";
import { useUser } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useUser();
  const pathname = usePathname();

  console.log("🔒 ProtectedRoute check:", {
    isLoading: user.isLoading,
    hasUser: !!user.data,
    userId: user.data?.id,
    pathname,
  });

  // Show loading state while checking authentication
  if (user.isLoading) {
    console.log("⏳ Authentication loading...");
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user.data) {
    console.log("🚫 No user found, redirecting to login");
    redirect(`/auth/login?redirectTo=${encodeURIComponent(pathname)}`);
  }

  console.log("✅ User authenticated, rendering protected content");
  return <>{children}</>;
};
