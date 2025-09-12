import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { SessionTimeoutWarning } from "@/features/session/components/SessionTimeoutWarning";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trading Dashboard",
  description: "Professional trading dashboard with real-time market data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <SessionTimeoutWarning />
          {children}
        </Providers>
      </body>
    </html>
  );
}
