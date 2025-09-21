'use client';

import { ReactNode } from "react";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import LocationAwareLayout from "../../components/LocationAwareLayout";

export default function ResourcesLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LocationAwareLayout showLocationPrompt={false} skipForGuests={false}>
        <Navbar />
        <main className="pt-20 px-4">{children}</main>
      </LocationAwareLayout>
    </AuthProvider>
  );
}