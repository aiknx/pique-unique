'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface Booking {
  id: string;
  location: string;
  date: string;
  theme: string;
  time: string;
  guestCount: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

export default function AdminBookingsPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
      return;
    }

    if (!loading && !isAdmin) {
      router.push('/');
      return;
    }

    if (isAdmin && user) {
      fetchBookings();
    }
  }, [user, isAdmin, loading, router]);

  const fetchBookings = useCallback(async () => {
    try {
      // Get Firebase ID token
      const idToken = await user?.getIdToken();
      
      if (!idToken) {
        console.error('No ID token available');
        return;
      }

      const response = await fetch('/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.bookings) {
          setBookings(data.bookings);
        }
      } else {
        console.error('Failed to fetch bookings:', response.status);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  }, [user]);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const idToken = await user?.getIdToken();
      
      if (!idToken) {
        console.error('No ID token available');
        return;
      }

      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (!confirm('Ar tikrai norite ištrinti šią rezervaciją?')) {
      return;
    }

    try {
      const idToken = await user?.getIdToken();
      
      if (!idToken) {
        console.error('No ID token available');
        return;
      }

      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.ok) {
        fetchBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  if (loading || loadingBookings) {
    return (
      <div className="min-h-screen bg-white-smoke flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blush mx-auto"></div>
          <p className="mt-4 text-hunter-green">Kraunama...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white-smoke">
      <div className="container-custom py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-hunter-green mb-6">Rezervacijų Valdymas</h1>
          
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nėra rezervacijų</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-cambridge-blue text-white">
                    <th className="p-3 text-left">Data</th>
                    <th className="p-3 text-left">Laikas</th>
                    <th className="p-3 text-left">Vieta</th>
                    <th className="p-3 text-left">Tema</th>
                    <th className="p-3 text-left">Svečiai</th>
                    <th className="p-3 text-left">Kaina</th>
                    <th className="p-3 text-left">Statusas</th>
                    <th className="p-3 text-left">Klientas</th>
                    <th className="p-3 text-left">Veiksmai</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {new Date(booking.date).toLocaleDateString('lt-LT')}
                      </td>
                      <td className="p-3">{booking.time}</td>
                      <td className="p-3">{booking.location}</td>
                      <td className="p-3">{booking.theme}</td>
                      <td className="p-3">{booking.guestCount}</td>
                      <td className="p-3">{booking.totalPrice} €</td>
                      <td className="p-3">
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="pending">Laukia</option>
                          <option value="confirmed">Patvirtinta</option>
                          <option value="cancelled">Atšaukta</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{booking.contactInfo.name}</div>
                          <div className="text-sm text-gray-500">{booking.contactInfo.email}</div>
                          <div className="text-sm text-gray-500">{booking.contactInfo.phone}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                            className="bg-cambridge-blue text-white px-3 py-1 rounded text-sm hover:bg-opacity-90"
                          >
                            Peržiūrėti
                          </button>
                          <button
                            onClick={() => deleteBooking(booking.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-opacity-90"
                          >
                            Ištrinti
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 