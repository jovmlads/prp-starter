import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Trading Dashboard
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional trading platform with real-time market data, advanced
            analytics, and enterprise-grade security for traders and investors.
          </p>

          <div className="space-x-4">
            <Link href="/auth/register">
              <Button size="lg" className="px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-semibold text-card-foreground mb-3">
              Real-time Data
            </h3>
            <p className="text-muted-foreground">
              Access live market data with millisecond precision for informed
              trading decisions.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-semibold text-card-foreground mb-3">
              Advanced Analytics
            </h3>
            <p className="text-muted-foreground">
              Powerful charting tools and technical indicators to analyze market
              trends.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-semibold text-card-foreground mb-3">
              Enterprise Security
            </h3>
            <p className="text-muted-foreground">
              Bank-grade security with JWT authentication and row-level data
              protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
