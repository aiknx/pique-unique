'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, enableNetwork, disableNetwork } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase/schema';

interface Booking {
  id: string;
  userId: string;
  date: string;
  status: string;
  theme: string;
  location: string;
  createdAt: Date;
}

interface User {
  id: string;
  email: string;
  displayName?: string;
  isAdmin?: boolean;
  createdAt: Date;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to enable network
        await enableNetwork(db);

        // Fetch recent bookings
        const bookingsQuery = query(
          collection(db, COLLECTIONS.BOOKINGS),
          orderBy('createdAt', 'desc')
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookingsData = bookingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Booking));

        // Fetch users
        const usersQuery = query(
          collection(db, COLLECTIONS.USERS),
          orderBy('createdAt', 'desc')
        );
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as User));

        setBookings(bookingsData);
        setUsers(usersData);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Klaida gaunant duomenis');
        
        // If we're offline, try to disable network and use cached data
        if (error.message.includes('offline')) {
          try {
            console.log('Switching to offline mode...');
            await disableNetwork(db);
            console.log('Network disabled, trying to fetch cached data...');

            // Try to fetch data again (this will use cached data)
            const bookingsQuery = query(
              collection(db, COLLECTIONS.BOOKINGS),
              orderBy('createdAt', 'desc')
            );
            const bookingsSnapshot = await getDocs(bookingsQuery);
            const bookingsData = bookingsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as Booking));

            const usersQuery = query(
              collection(db, COLLECTIONS.USERS),
              orderBy('createdAt', 'desc')
            );
            const usersSnapshot = await getDocs(usersQuery);
            const usersData = usersSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as User));

            setBookings(bookingsData);
            setUsers(usersData);
            setError('Naudojami vietiniai duomenys (offline režimas)');
            
            // Try to re-enable network in the background
            enableNetwork(db).catch(e => {
              console.warn('Failed to re-enable network:', e);
            });
          } catch (offlineError) {
            console.error('Error fetching offline data:', offlineError);
            setError('Nepavyko gauti duomenų net offline režime');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-hunter-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Bandyti iš naujo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Administratoriaus Skydelis</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Viso Užsakymų</h2>
            <p className="text-3xl font-bold text-hunter-green">{bookings.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Viso Vartotojų</h2>
            <p className="text-3xl font-bold text-hunter-green">{users.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Administratorių</h2>
            <p className="text-3xl font-bold text-hunter-green">
              {users.filter(user => user.isAdmin).length}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Naujausi Užsakymai</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tema
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vieta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statusas
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(booking.date).toLocaleDateString('lt-LT')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.theme}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {booking.status === 'confirmed' ? 'Patvirtinta' :
                       booking.status === 'pending' ? 'Laukiama' : 'Atšaukta'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Naujausi Vartotojai</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  El. Paštas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vardas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rolė
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registracijos Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.slice(0, 5).map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.displayName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.isAdmin ? 'Administratorius' : 'Vartotojas'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString('lt-LT')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 