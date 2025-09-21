
import "./globals.css";
import { ReactNode } from "react";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import LocationAwareLayout from "../components/LocationAwareLayout";

export const metadata = {
  title: "SoulSync",
  description: "A mental wellness companion app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 text-gray-900">
        <AuthProvider>
          <LocationAwareLayout showLocationPrompt={false} skipForGuests={false}>
            <Navbar />
            <main className="pt-20 px-4">{children}</main>
          </LocationAwareLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
