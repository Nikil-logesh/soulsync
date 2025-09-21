'use client';

import { ReactNode } from "react";
import AuthProvider from "@/components/AuthProvider";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}