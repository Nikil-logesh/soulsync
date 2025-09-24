
import "./globals.css";
import { ReactNode } from "react";
import ClientLayout from './ClientLayout';

export const metadata = {
  title: "SoulSync",
  description: "A mental wellness companion app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 text-gray-900">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
