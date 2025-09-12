"use client";

import { useState, useEffect } from "react";
import {
  useSessionTimeout,
  useExtendSession,
} from "@/features/session/hooks/useSession";
import { useLogout } from "@/lib/auth";
import { Button } from "@/components/ui/button";

interface SessionTimeoutWarningProps {
  className?: string;
}

export function SessionTimeoutWarning({
  className,
}: SessionTimeoutWarningProps) {
  const { data: sessionData } = useSessionTimeout();
  const extendSession = useExtendSession();
  const logout = useLogout();
  const [dismissed, setDismissed] = useState(false);

  const { timeUntilExpiry, showWarning } = sessionData || {
    timeUntilExpiry: 0,
    showWarning: false,
  };

  // Reset dismissed state when warning should show again
  useEffect(() => {
    if (showWarning && timeUntilExpiry > 4 * 60 * 1000) {
      setDismissed(false);
    }
  }, [showWarning, timeUntilExpiry]);

  // Auto-logout when session expires
  useEffect(() => {
    if (timeUntilExpiry <= 0) {
      logout.mutate({});
    }
  }, [timeUntilExpiry, logout]);

  const handleExtendSession = () => {
    extendSession.mutate(undefined, {
      onSuccess: () => {
        setDismissed(true);
      },
    });
  };

  const handleLogout = () => {
    logout.mutate({});
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / (60 * 1000));
    const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!showWarning || dismissed) {
    return null;
  }

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50 
        bg-yellow-50 border-b border-yellow-200 
        p-4 shadow-sm
        ${className}
      `}
      data-testid="session-timeout-warning"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Your session will expire in {formatTime(timeUntilExpiry)}
            </p>
            <p className="text-sm text-yellow-700">
              Extend your session to continue working, or you'll be logged out
              automatically.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDismissed(true)}
            className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
          >
            Dismiss
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
          >
            Logout Now
          </Button>
          <Button
            size="sm"
            onClick={handleExtendSession}
            disabled={extendSession.isPending}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {extendSession.isPending ? "Extending..." : "Extend Session"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Hook to automatically show session warnings
export function useSessionWarning() {
  const { data: sessionData } = useSessionTimeout();
  const { showWarning } = sessionData || { showWarning: false };

  return { showWarning };
}
