'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function TestAuthPage() {
  const { user, loading, isAdmin, signOut, error } = useAuth();
  const [sessionData, setSessionData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Test session endpoint
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setSessionData(data);
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    checkSession();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter"></div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-linen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Autentifikacijos Testas</h1>
          
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg">
              <p>Klaida: {error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-2">Vartotojo Informacija:</h2>
              <pre className="bg-gray-50 p-4 rounded overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-2">Sesijos Informacija:</h2>
              <pre className="bg-gray-50 p-4 rounded overflow-auto">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-2">Administratoriaus Teisės:</h2>
              <p>{isAdmin ? 'Taip' : 'Ne'}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Atsijungti
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-hunter text-white rounded hover:bg-hunter/90 transition"
            >
              Bandyti Pasiekti Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 