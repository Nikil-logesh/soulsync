'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { supabase, UserRole, LoginCredentials, authenticateUser } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  signInWithSupabase: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Check for persisted auth state
    const persistedUser = localStorage.getItem('soulsync_user');
    const persistedRole = localStorage.getItem('soulsync_role');
    
    if (persistedUser && persistedRole) {
      try {
        const userData = JSON.parse(persistedUser);
        setUser(userData);
        setUserRole(persistedRole as UserRole);
        console.log('Restored user session:', userData.email, persistedRole);
      } catch (error) {
        console.error('Error parsing persisted user:', error);
        localStorage.removeItem('soulsync_user');
        localStorage.removeItem('soulsync_role');
      }
    }
    
    setLoading(false);
  }, []);

  const signInWithSupabase = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      console.log('Attempting to sign in with:', { email, password });
      
      // Use the helper function that bypasses RLS
      const userData = await authenticateUser(email, password);
      
      console.log('Authentication result:', { userData, hasUser: !!userData });

      if (!userData) {
        console.error('No matching user found for credentials');
        throw new Error('Invalid email or password');
      }

      // Create a user object for session management
      const userObject = {
        uid: `supabase_${userData.id}`,
        email: userData.email,
        displayName: userData.role,
      } as User;

      // Persist authentication state
      localStorage.setItem('soulsync_user', JSON.stringify(userObject));
      localStorage.setItem('soulsync_role', userData.role);

      setUser(userObject);
      setUserRole(userData.role);
      
      console.log('User signed in with role:', userData.role);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Clear persisted authentication state
      localStorage.removeItem('soulsync_user');
      localStorage.removeItem('soulsync_role');
      
      // Clear local state
      setUser(null);
      setUserRole(null);
      
      // Also sign out from Firebase (though we may not have a real Firebase user)
      try {
        await firebaseSignOut(auth);
      } catch (firebaseError) {
        // Ignore Firebase signout errors since we use a hybrid system
        console.log('Firebase signout skipped (hybrid auth)');
      }
      
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    loading,
    signInWithSupabase,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}