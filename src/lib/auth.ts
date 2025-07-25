'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { COLLECTIONS } from './firebase/schema';

export type UserRole = 'admin' | 'user';

interface AuthUser extends User {
  isAdmin?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const firebaseError = error as { code: string; message: string };
    switch (firebaseError.code) {
      case 'auth/user-not-found':
        return 'Vartotojas nerastas';
      case 'auth/wrong-password':
        return 'Neteisingas slaptažodis';
      case 'auth/email-already-in-use':
        return 'Šis el. paštas jau naudojamas';
      case 'auth/weak-password':
        return 'Slaptažodis per silpnas';
      case 'auth/invalid-email':
        return 'Neteisingas el. pašto formatas';
      case 'auth/too-many-requests':
        return 'Per daug bandymų. Bandykite vėliau';
      default:
        return firebaseError.message || 'Įvyko klaida';
    }
  }
  return 'Įvyko klaida';
};

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

// Function to save user data to Firestore
const saveUserToFirestore = async (user: AuthUser) => {
  try {
    // Check if user already exists
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
    const existingData = userDoc.data();
    
    const userData = {
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      isAdmin: existingData?.isAdmin || false, // Keep existing admin status
      createdAt: existingData?.createdAt || new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
    };

    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userData, { merge: true });
    console.log('User data saved to Firestore:', user.uid);
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
  }
};

const createServerSession = async (idToken: string): Promise<boolean> => {
  try {
    // Check if we're in emulator environment
    const isEmulator = process.env.NODE_ENV === 'development';
    
    if (isEmulator) {
      // In emulator, skip session creation
      console.log('Emulator environment - skipping session creation');
      return true;
    }

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const authUser = user as AuthUser;
        
        // Save user data to Firestore if it's a new user
        await saveUserToFirestore(authUser);
        
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

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();
      await createServerSession(idToken);
      
      const authUser = result.user as AuthUser;
      
      // Save new user data to Firestore
      await saveUserToFirestore(authUser);
      
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
      
      // Save user data to Firestore (Google users might be new)
      await saveUserToFirestore(authUser);
      
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

  const contextValue = {
    user,
    loading,
    isAdmin,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    clearError
  };

  return React.createElement(AuthContext.Provider, { value: contextValue }, children);
} 