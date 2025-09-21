'use client';

import { useAuth } from './AuthContext';

// Safe hook that handles cases where auth context might not be available (e.g., during static generation)
export function useSafeAuth() {
  try {
    return useAuth();
  } catch (error) {
    // During static generation or if context is not available
    return {
      user: null,
      loading: false,
      signInWithGoogle: async () => {},
      signOut: async () => {}
    };
  }
}