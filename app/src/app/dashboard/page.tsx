"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { useUser, useLogout } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const user = useUser();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/auth/login";
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Trading Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome,{" "}
                {user.data?.user_metadata?.firstName || user.data?.email}
              </div>

              <Link
                href="/account"
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                Account Settings
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                isLoading={logout.isPending}
                data-testid="logout-button"
              >
                {logout.isPending ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="text-gray-600">
            Manage your trading portfolio and view market data
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Portfolio Value
            </h3>
            <p className="text-3xl font-bold text-green-600">$125,430.50</p>
            <p className="text-sm text-gray-500">+2.3% from yesterday</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Active Positions
            </h3>
            <p className="text-3xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-500">Across 8 different assets</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Today's P&L
            </h3>
            <p className="text-3xl font-bold text-green-600">+$2,847.30</p>
            <p className="text-sm text-gray-500">+2.32% performance</p>
          </div>
        </div>

        {/* Account Management Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Account Management
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/account"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Account Settings</p>
                  <p className="text-sm text-gray-500">
                    Manage profile and security
                  </p>
                </div>
              </Link>

              <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Trading History</p>
                  <p className="text-sm text-gray-500">
                    View past transactions
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex-shrink-0">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Market Analysis</p>
                  <p className="text-sm text-gray-500">Real-time market data</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Buy AAPL</p>
                  <p className="text-sm text-gray-500">100 shares at $185.50</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">$18,550.00</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Sell TSLA</p>
                  <p className="text-sm text-gray-500">50 shares at $242.30</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">$12,115.00</p>
                  <p className="text-sm text-gray-500">4 hours ago</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Buy NVDA</p>
                  <p className="text-sm text-gray-500">25 shares at $487.20</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">$12,180.00</p>
                  <p className="text-sm text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
