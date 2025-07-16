'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { signInWithEmail, signInWithGoogle as firebaseSignInWithGoogle, signOut as firebaseSignOut, onAuthChange } from './firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const defaultContext: AuthContextType = {
  user: null,
  loading: true,
  isAdmin: false,
  error: null,
  signIn: async () => { throw new Error('AuthContext not initialized'); },
  signInWithGoogle: async () => { throw new Error('AuthContext not initialized'); },
  signOut: async () => { throw new Error('AuthContext not initialized'); },
  clearError: () => { throw new Error('AuthContext not initialized'); }
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

interface UserData {
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
  createdAt: Date;
}

const createUserDocument = async (user: User): Promise<UserData> => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const userData: UserData = {
      email: user.email!,
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined,
      createdAt: new Date(),
      isAdmin: false // Default to false for new users
    };
    await setDoc(userRef, userData);
    return userData;
  }

  return userSnap.data() as UserData;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        const userData = await createUserDocument(user);
        setIsAdmin(userData.isAdmin || false);
      } else {
        setIsAdmin(false);
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmail(email, password);
      const userData = await createUserDocument(result.user);
      setIsAdmin(userData.isAdmin || false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prisijungimo klaida');
      throw err;
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const result = await firebaseSignInWithGoogle();
      const userData = await createUserDocument(result.user);
      setIsAdmin(userData.isAdmin || false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google prisijungimo klaida');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut();
      setIsAdmin(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Atsijungimo klaida');
      throw err;
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
      signInWithGoogle: handleSignInWithGoogle, 
      signOut,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
} 