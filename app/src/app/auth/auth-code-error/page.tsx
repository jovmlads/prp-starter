import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Trading Dashboard
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-red-600">
            Email Verification Failed
          </h2>
          <p className="mt-4 text-gray-600">
            The email verification link is invalid or has expired.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-700">This can happen if:</p>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• The verification link has expired</li>
              <li>• The link has already been used</li>
              <li>• The link was corrupted in transit</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link href="/auth/login" className="block">
              <Button className="w-full">Try Signing In</Button>
            </Link>

            <Link href="/auth/register" className="block">
              <Button variant="outline" className="w-full">
                Create New Account
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a
              href="mailto:support@tradingdashboard.com"
              className="text-blue-600 hover:text-blue-500"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
