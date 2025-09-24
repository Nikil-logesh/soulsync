'use client';

import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import LocationAwareLayout from "../../components/LocationAwareLayout";

export default function SigninLayout({ children }: { children: ReactNode }) {
  return (
    <LocationAwareLayout showLocationPrompt={false} skipForGuests={false}>
      <Navbar />
      <main className="pt-20 px-4">{children}</main>
    </LocationAwareLayout>
  );
}