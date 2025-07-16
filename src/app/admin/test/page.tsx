'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminTestPage() {
  const { user, loading, isAdmin } = useAuth();
  const [adminData, setAdminData] = useState<unknown>(null);
  const router = useRouter();

  useEffect(() => {
    // Test admin session
    const checkAdminAccess = async () => {
      try {
        const response = await fetch('/api/admin/test');
        if (!response.ok) {
          throw new Error('Admin access denied');
        }
        const data = await response.json();
        setAdminData(data);
      } catch (error) {
        console.error('Admin check error:', error);
        router.push('/');
      }
    };

    if (user && !loading) {
      checkAdminAccess();
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-linen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 text-red-800 p-6 rounded-lg">
            <h1 className="text-xl font-bold mb-2">Prieiga Uždrausta</h1>
            <p>Jūs neturite administratoriaus teisių.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Grįžti į Pagrindinį Puslapį
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Testas</h1>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-2">Admin Vartotojo Informacija:</h2>
              <pre className="bg-gray-50 p-4 rounded overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-2">Admin API Duomenys:</h2>
              <pre className="bg-gray-50 p-4 rounded overflow-auto">
                {JSON.stringify(adminData, null, 2)}
              </pre>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/test-auth')}
              className="px-4 py-2 bg-hunter text-white rounded hover:bg-hunter/90 transition"
            >
              Grįžti į Auth Testą
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 