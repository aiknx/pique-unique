'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth/client';

type User = {
  uid: string;
  email: string | null;
  name?: string;
  picture?: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser({
            uid: userData.uid,
            email: userData.email,
            name: userData.displayName || undefined,
            picture: userData.photoURL || undefined,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
} 