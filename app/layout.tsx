import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "RideFlow — Premium Ride Booking",
  description: "Book rides, track drivers, and manage your trips with RideFlow.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider afterSignInUrl="/callback" afterSignUpUrl="/callback">
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="bg-dark-900 text-slate-200 min-h-screen font-inter antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
