'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { COLLECTIONS } from '../firebase/schema';

// Types
export type UserRole = 'admin' | 'user';

export interface AuthUser extends User {
  role?: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

// Error messages in Lithuanian
const AUTH_ERRORS = {
  'auth/invalid-email': 'Neteisingas el. pašto formatas',
  'auth/user-disabled': 'Šis vartotojas yra užblokuotas',
  'auth/user-not-found': 'Vartotojas su šiuo el. paštu nerastas',
  'auth/wrong-password': 'Neteisingas slaptažodis',
  'auth/too-many-requests': 'Per daug bandymų prisijungti. Pabandykite vėliau',
  'auth/popup-closed-by-user': 'Prisijungimo langas buvo uždarytas',
  'auth/cancelled-popup-request': 'Prisijungimo langas buvo uždarytas',
  'auth/popup-blocked': 'Prisijungimo langas buvo užblokuotas. Prašome leisti iššokančius langus',
  'default': 'Įvyko klaida. Bandykite dar kartą',
} as const;

// Create auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  error: null,
  signIn: async () => { throw new Error('AuthContext not initialized'); },
  signInWithGoogle: async () => { throw new Error('AuthContext not initialized'); },
  signOut: async () => { throw new Error('AuthContext not initialized'); },
  clearError: () => { throw new Error('AuthContext not initialized'); },
});

// Helper function to get error message
const getErrorMessage = (error: unknown): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code?: string }).code === 'string' &&
    AUTH_ERRORS[(error as { code: string }).code as keyof typeof AUTH_ERRORS]
  ) {
    return AUTH_ERRORS[(error as { code: string }).code as keyof typeof AUTH_ERRORS];
  }
  return AUTH_ERRORS.default;
};

// Helper function to check if user is admin
const isUserAdmin = async (user: AuthUser | null): Promise<boolean> => {
  if (!user) return false;
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
    const userData = userDoc.data();
    return userData?.isAdmin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Create session on the server
const createServerSession = async (idToken: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create session');
    }
    
    return true;
  } catch (error) {
    console.error('Session creation error:', error);
    return false;
  }
};

// Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const authUser = user as AuthUser;
        const admin = await isUserAdmin(authUser);
        setIsAdmin(admin);
        setUser(authUser);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();
      await createServerSession(idToken);
      
      const authUser = result.user as AuthUser;
      setIsAdmin(await isUserAdmin(authUser));
      setUser(authUser);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await createServerSession(idToken);
      
      const authUser = result.user as AuthUser;
      setIsAdmin(await isUserAdmin(authUser));
      setUser(authUser);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsAdmin(false);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin,
      error,
      signIn,
      signInWithGoogle,
      signOut,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Auth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 