'use client';

import { ReactNode } from 'react';
import { AuthProvider as FirebaseAuthProvider } from '../contexts/AuthContext';

export default function AuthProvider({ children }: { children: ReactNode }) {
  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
}