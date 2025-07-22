'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { doc, getDoc, collection, where, query, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import { COLLECTIONS } from './firebase/schema';

export type UserRole = 'admin' | 'user';

export interface AuthUser extends User {
  role?: UserRole;
}

interface AdminAuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

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

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isAuthenticated: false,
  error: null,
  signIn: async () => { throw new Error('AdminAuthContext not initialized'); },
  signInWithGoogle: async () => { throw new Error('AdminAuthContext not initialized'); },
  signOut: async () => { throw new Error('AdminAuthContext not initialized'); },
  clearError: () => { throw new Error('AdminAuthContext not initialized'); },
});

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

const isUserAdmin = async (user: AuthUser | null): Promise<boolean> => {
  if (!user) return false;
  
  try {
    // In development, allow admin access for specific email
    if (process.env.NODE_ENV === 'development' && user.email === 'admin@test.com') {
      console.log('Development mode: Admin access granted for admin@test.com');
      return true;
    }
    
    // Try to get user document by UID first
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
    let userData = userDoc.data();
    
    // If not found by UID, try to find by email (for emulator compatibility)
    if (!userData && user.email) {
      console.log('User document not found by UID, searching by email...');
      const usersRef = collection(db, COLLECTIONS.USERS);
      const q = query(usersRef, where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        userData = querySnapshot.docs[0].data();
        console.log('Found user document by email:', userData);
      }
    }
    
    return userData?.isAdmin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    // In development, fallback to email check
    if (process.env.NODE_ENV === 'development' && user.email === 'admin@test.com') {
      console.log('Development mode: Fallback admin access for admin@test.com');
      return true;
    }
    return false;
  }
};

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

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const authUser = user as AuthUser;
        const admin = await isUserAdmin(authUser);
        
        // In development, allow admin@test.com to proceed even if Firestore check fails
        if (!admin && process.env.NODE_ENV === 'development' && authUser.email === 'admin@test.com') {
          console.log('Development mode: Allowing admin@test.com to proceed (useEffect)');
          setIsAdmin(true);
          setUser(authUser);
          setIsAuthenticated(true);
        } else {
          setIsAdmin(admin);
          setUser(authUser);
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsAuthenticated(false);
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
      const admin = await isUserAdmin(authUser);
      
      // In development, allow admin@test.com to proceed even if Firestore check fails
      if (!admin && process.env.NODE_ENV === 'development' && email === 'admin@test.com') {
        console.log('Development mode: Allowing admin@test.com to proceed');
        setIsAdmin(true);
        setUser(authUser);
        setIsAuthenticated(true);
        return;
      }
      
      if (!admin) {
        throw new Error('Access denied. Admin privileges required.');
      }
      setIsAdmin(admin);
      setUser(authUser);
      setIsAuthenticated(true);
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
      const admin = await isUserAdmin(authUser);
      
      // In development, allow admin@test.com to proceed even if Firestore check fails
      if (!admin && process.env.NODE_ENV === 'development' && authUser.email === 'admin@test.com') {
        console.log('Development mode: Allowing admin@test.com to proceed (Google)');
        setIsAdmin(true);
        setUser(authUser);
        setIsAuthenticated(true);
        return;
      }
      
      if (!admin) {
        throw new Error('Access denied. Admin privileges required.');
      }
      setIsAdmin(admin);
      setUser(authUser);
      setIsAuthenticated(true);
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
      setIsAuthenticated(false);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const clearError = () => setError(null);

  const contextValue = {
    user,
    loading,
    isAdmin,
    isAuthenticated,
    error,
    signIn,
    signInWithGoogle,
    signOut,
    clearError
  };

  return React.createElement(AdminAuthContext.Provider, { value: contextValue }, children);
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
} 