'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function DashboardPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Jei neprisijungęs, nukreipti į prisijungimą
        router.push('/auth/signin');
      } else if (isAdmin) {
        // Jei admin, nukreipti į admin panelį
        router.push('/admin/bookings');
      } else {
        // Jei paprastas vartotojas, nukreipti į rezervaciją
        router.push('/booking');
      }
    }
  }, [user, isAdmin, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter"></div>
      </div>
    );
  }

  return null; // Puslapis bus nukreiptas
} 