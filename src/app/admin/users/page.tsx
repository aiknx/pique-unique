'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  displayName?: string;
  isAdmin?: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export default function AdminUsersPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      setError(null);

      const idToken = await user?.getIdToken();
      if (!idToken) {
        setError('Nėra autentifikacijos');
        return;
      }

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setError('Klaida gaunant vartotojus');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Klaida gaunant vartotojus');
    } finally {
      setLoadingUsers(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (!loading && !isAdmin) {
      router.push('/');
      return;
    }

    if (isAdmin && user) {
      fetchUsers();
    }
  }, [user, isAdmin, loading, router, fetchUsers]);

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Kraunama...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-hunter-green">Vartotojų Valdymas</h1>
          <div className="text-sm text-gray-600">
            Viso vartotojų: {users.length}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vartotojas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    El. paštas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statusas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registracijos data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paskutinis prisijungimas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-hunter-green flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.displayName || 'Nenurodyta'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isAdmin 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.isAdmin ? 'Admin' : 'Vartotojas'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('lt-LT') : 'Nenurodyta'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('lt-LT') : 'Nenurodyta'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nėra vartotojų</h3>
              <p className="text-gray-500">Vartotojai pasirodys čia, kai jie užsiregistruos</p>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Viso vartotojų</p>
                <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administratoriai</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => u.isAdmin).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paprasti vartotojai</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {users.filter(u => !u.isAdmin).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 