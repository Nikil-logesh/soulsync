'use client';

import { useAuth } from './AuthContext';

// Safe hook that handles cases where auth context might not be available (e.g., during static generation)
export function useSafeAuth() {
  try {
    return useAuth();
  } catch (error) {
    // During static generation or if context is not available
    // Set loading to true to prevent premature redirects
    return {
      user: null,
      userRole: null,
      loading: true,
      signInWithSupabase: async (email: string, password: string) => {},
      signOut: async () => {}
    };
  }
}