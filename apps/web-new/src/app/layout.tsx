
import "./globals.css";
import { ReactNode } from "react";
import ClientLayout from './ClientLayout';

export const metadata = {
  title: "SoulSync",
  description: "A mental wellness companion app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6aa16a" />
      </head>
      <body className="min-h-screen wellness-gradient antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
