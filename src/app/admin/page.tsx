'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Booking {
  id: string;
  userId: string;
  date: string;
  status: string;
  theme: string;
  location: string;
  totalPrice: number;
  guestCount: number;
  contactInfo: {
    name: string;
    email: string;
  };
  createdAt: Date;
}

interface User {
  id: string;
  email: string;
  displayName?: string;
  isAdmin?: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  totalUsers: number;
  recentBookings: Booking[];
  recentUsers: User[];
}

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentBookings: [],
    recentUsers: []
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      setError(null);

      const idToken = await user?.getIdToken();
      if (!idToken) {
        setError('Nėra autentifikacijos');
        return;
      }

      // Fetch bookings
      const bookingsResponse = await fetch('/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        const bookings = bookingsData.bookings || [];

        // Calculate stats
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter((b: Booking) => b.status === 'pending').length;
        const confirmedBookings = bookings.filter((b: Booking) => b.status === 'confirmed').length;
        const totalRevenue = bookings
          .filter((b: Booking) => b.status === 'confirmed')
          .reduce((sum: number, b: Booking) => sum + (b.totalPrice || 0), 0);

        // Get recent bookings (last 5)
        const recentBookings = bookings.slice(0, 5);

        setStats(prev => ({
          ...prev,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          totalRevenue,
          recentBookings
        }));
      }

      // Fetch users (if we have a users API endpoint)
      try {
        const usersResponse = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          const users = usersData.users || [];
          const recentUsers = users.slice(0, 5);

          setStats(prev => ({
            ...prev,
            totalUsers: users.length,
            recentUsers
          }));
        }
      } catch {
        console.log('Users API not available yet');
      }

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Klaida gaunant statistikas');
    } finally {
      setLoadingStats(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth/signin');
      return;
    }

    if (!loading && !isAdmin) {
      router.push('/');
      return;
    }

    if (isAdmin && user) {
      fetchDashboardStats();
    }
  }, [user, isAdmin, loading, router, fetchDashboardStats]);

  if (loading || loadingStats) {
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-hunter-green mb-2">
            Administratoriaus Skydelis
          </h1>
          <p className="text-gray-600">
            Sveiki atvykę į Pique Unique administravimo sistemą
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Viso užsakymų</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Laukia patvirtinimo</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Patvirtinti</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.confirmedBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pajamos</p>
                <p className="text-2xl font-semibold text-gray-900">€{stats.totalRevenue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Greiti Veiksmai</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/bookings"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Užsakymai</h3>
                <p className="text-sm text-gray-600">Valdyti rezervacijas</p>
              </div>
            </Link>

            <Link
              href="/admin/themes"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Temos</h3>
                <p className="text-sm text-gray-600">Valdyti pikniko temas</p>
              </div>
            </Link>

            <Link
              href="/admin/reviews"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Atsiliepimai</h3>
                <p className="text-sm text-gray-600">Valdyti atsiliepimus</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Naujausi Užsakymai</h2>
              <Link
                href="/admin/bookings"
                className="text-hunter-green hover:text-hunter-dark text-sm font-medium"
              >
                Peržiūrėti visus
              </Link>
            </div>
            
            {stats.recentBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nėra naujų užsakymų</p>
            ) : (
              <div className="space-y-4">
                {stats.recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{booking.contactInfo?.name || 'Nenurodyta'}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.date).toLocaleDateString('lt-LT')} - {booking.theme}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">€{booking.totalPrice}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status === 'confirmed' ? 'Patvirtinta' :
                         booking.status === 'pending' ? 'Laukia' : 'Atšaukta'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Naujausi Vartotojai</h2>
              <span className="text-sm text-gray-600">Viso: {stats.totalUsers}</span>
            </div>
            
            {stats.recentUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nėra naujų vartotojų</p>
            ) : (
              <div className="space-y-4">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-600">
                        Registruotas: {new Date(user.createdAt).toLocaleDateString('lt-LT')}
                      </p>
                    </div>
                    <div className="text-right">
                      {user.isAdmin && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 