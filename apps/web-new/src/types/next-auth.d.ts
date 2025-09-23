// Types for next-auth, including our custom fields
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      domain?: string;
      anonymousName?: string;
      age?: number;
      gender?: string;
      preferredLanguage?: string;
      institution?: string;
      onboardingCompleted?: boolean;
      locationData?: {
        country?: string;
        state?: string;
        city?: string;
      };
    }
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    domain?: string;
    anonymousName?: string;
    age?: number;
    gender?: string;
    preferredLanguage?: string;
    institution?: string;
    onboardingCompleted?: boolean;
    locationData?: {
      country?: string;
      state?: string;
      city?: string;
    };
  }
}