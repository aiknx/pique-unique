'use client';

import { AuthProvider } from '@/lib/auth';
import { AdminAuthProvider } from '@/lib/adminAuth';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        {children}
      </AdminAuthProvider>
    </AuthProvider>
  );
} 