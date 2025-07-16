'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from '../firebase/schema';

export type UserRole = 'admin' | 'user' | null;

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
}

interface AdminAuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false
});

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// Check admin role in Firestore
const getUserRole = async (user: { uid: string; email: string | null }): Promise<UserRole> => {
  if (!user) return null;
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
    const userData = userDoc.data();
    return userData?.isAdmin ? 'admin' : 'user';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return 'user';
  }
};

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async () => {
      if (!user) {
        if (mounted) {
          setAdminUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const role = await getUserRole(user);
        if (mounted) {
          if (role === 'admin') {
            setAdminUser({
              uid: user.uid,
              email: user.email,
              role: role,
            });
          } else {
            setAdminUser(null);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        if (mounted) {
          setAdminUser(null);
          setIsLoading(false);
        }
      }
    };

    if (!loading) {
      checkAdminStatus();
    }

    return () => {
      mounted = false;
    };
  }, [user, loading]);

  return (
    <AdminAuthContext.Provider
      value={{
        user: adminUser,
        isLoading: isLoading,
        isAuthenticated: !!adminUser && adminUser.role === 'admin'
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
} 