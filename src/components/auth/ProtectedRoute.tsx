'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import type { User } from 'firebase/auth';

interface ExtendedUser extends User {
  role?: 'admin' | 'user';
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const extendedUser = user as ExtendedUser;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/signin?from=${pathname}`);
      } else if (requireAdmin && extendedUser?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, loading, router, pathname, requireAdmin, extendedUser?.role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hunter"></div>
      </div>
    );
  }

  if (!user || (requireAdmin && extendedUser?.role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
} 