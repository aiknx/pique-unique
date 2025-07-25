'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Booking {
  id: string;
  location: string;
  date: string;
  theme: string;
  time: string;
  guestCount: number;
  basePrice: number;
  additionalServices: string[];
  additionalPrice: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  userId: string | null;
  userEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBookingDetailsPage({ params }: { params: { id: string } }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchBooking = useCallback(async () => {
    try {
      const idToken = await user?.getIdToken();
      
      if (!idToken) {
        console.error('No ID token available');
        return;
      }

      const response = await fetch(`/api/admin/bookings/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.booking) {
          setBooking(data.booking);
        }
      } else {
        console.error('Failed to fetch booking:', response.status);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoadingBooking(false);
    }
  }, [user, params.id]);

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
      fetchBooking();
    }
  }, [user, isAdmin, loading, router, params.id, fetchBooking]);

  const updateBookingStatus = async (status: string) => {
    if (!booking) return;

    setUpdating(true);
    try {
      const idToken = await user?.getIdToken();
      
      if (!idToken) {
        console.error('No ID token available');
        return;
      }

      const response = await fetch(`/api/admin/bookings/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setBooking(prev => prev ? { ...prev, status: status as 'pending' | 'confirmed' | 'cancelled' } : null);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setUpdating(false);
    }
  };

  const deleteBooking = async () => {
    if (!confirm('Ar tikrai norite ištrinti šią rezervaciją?')) {
      return;
    }

    try {
      const idToken = await user?.getIdToken();
      
      if (!idToken) {
        console.error('No ID token available');
        return;
      }

      const response = await fetch(`/api/admin/bookings/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.ok) {
        router.push('/admin/bookings');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  if (loading || loadingBooking) {
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

  if (!booking) {
    return (
      <div className="min-h-screen bg-white-smoke flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Rezervacija nerasta</p>
          <Link href="/admin/bookings" className="btn-primary mt-4 inline-block">
            Grįžti į sąrašą
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-smoke">
      <div className="container-custom py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-hunter-green">Rezervacijos Detalės</h1>
            <div className="flex space-x-4">
              <Link href="/admin/bookings" className="btn-secondary">
                Grįžti į sąrašą
              </Link>
              <button
                onClick={deleteBooking}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
              >
                Ištrinti
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pagrindinė informacija */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-hunter-green">Pagrindinė Informacija</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statusas</label>
                  <select
                    value={booking.status}
                    onChange={(e) => updateBookingStatus(e.target.value)}
                    disabled={updating}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cambridge-blue"
                  >
                    <option value="pending">Laukia</option>
                    <option value="confirmed">Patvirtinta</option>
                    <option value="cancelled">Atšaukta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Data</label>
                  <p className="mt-1 text-gray-900">{new Date(booking.date).toLocaleDateString('lt-LT')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Laikas</label>
                  <p className="mt-1 text-gray-900">{booking.time}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Vieta</label>
                  <p className="mt-1 text-gray-900">{booking.location}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tema</label>
                  <p className="mt-1 text-gray-900">{booking.theme}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Svečių skaičius</label>
                  <p className="mt-1 text-gray-900">{booking.guestCount}</p>
                </div>
              </div>
            </div>

            {/* Kainos informacija */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-hunter-green">Kainos Informacija</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bazinė kaina</label>
                  <p className="mt-1 text-gray-900">{booking.basePrice} €</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Papildomos paslaugos</label>
                  <p className="mt-1 text-gray-900">{booking.additionalPrice} €</p>
                  {booking.additionalServices.length > 0 && (
                    <ul className="mt-1 text-sm text-gray-600">
                      {booking.additionalServices.map((service, index) => (
                        <li key={index}>• {service}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bendra kaina</label>
                  <p className="mt-1 text-xl font-bold text-hunter-green">{booking.totalPrice} €</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mokėjimo statusas</label>
                  <p className="mt-1 text-gray-900">{booking.paymentStatus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kliento informacija */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-hunter-green mb-4">Kliento Informacija</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vardas</label>
                <p className="mt-1 text-gray-900">{booking.contactInfo.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">El. paštas</label>
                <p className="mt-1 text-gray-900">{booking.contactInfo.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefonas</label>
                <p className="mt-1 text-gray-900">{booking.contactInfo.phone}</p>
              </div>
            </div>
          </div>

          {/* Sistemos informacija */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-hunter-green mb-4">Sistemos Informacija</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sukurta</label>
                <p className="mt-1 text-gray-900">{new Date(booking.createdAt).toLocaleString('lt-LT')}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Atnaujinta</label>
                <p className="mt-1 text-gray-900">{new Date(booking.updatedAt).toLocaleString('lt-LT')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 