'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useAdminAuth } from '@/lib/adminAuth';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAdminAuth();
  const { signOut } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Administratoriaus Skydelis
        </h1>
        <button
          onClick={signOut}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
        >
          Atsijungti
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-indigo-900 mb-2">Užsakymai</h2>
          <p className="text-indigo-700">0 aktyvūs užsakymai</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-green-900 mb-2">Papildomos paslaugos</h2>
          <p className="text-green-700">0 paslaugų</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-purple-900 mb-2">Atsiliepimai</h2>
          <p className="text-purple-700">0 atsiliepimų</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Naujausi Veiksmai
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 italic">Nėra naujų veiksmų</p>
        </div>
      </div>
    </div>
  );
} 