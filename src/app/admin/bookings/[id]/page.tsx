'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase/schema';
import { format } from 'date-fns';
import { lt } from 'date-fns/locale';
import Link from 'next/link';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface Booking {
  id: string;
  date: Date;
  timeSlot: {
    start: string;
    end: string;
  };
  location: string;
  guests: number;
  status: BookingStatus;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  themeName: string;
  themePrice: number;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);

        const docRef = doc(db, COLLECTIONS.BOOKINGS, params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBooking({
            id: docSnap.id,
            ...data,
            date: data.date.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate()
          } as Booking);
        } else {
          setError('Užsakymas nerastas');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Įvyko klaida gaunant užsakymo informaciją');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [params.id]);

  const handleStatusChange = async (newStatus: BookingStatus) => {
    if (!booking) return;

    try {
      setUpdating(true);
      const bookingRef = doc(db, COLLECTIONS.BOOKINGS, booking.id);
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: new Date()
      });

      setBooking(prev => prev ? {
        ...prev,
        status: newStatus,
        updatedAt: new Date()
      } : null);
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Nepavyko atnaujinti užsakymo statuso');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 'Laukiama';
      case 'confirmed': return 'Patvirtinta';
      case 'cancelled': return 'Atšaukta';
      case 'completed': return 'Įvykdyta';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hunter"></div>
      </div>
    );
  }

  if (error || !booking) {
  return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h1 className="text-xl font-semibold mb-2">Klaida</h1>
          <p>{error}</p>
          <Link href="/admin/bookings" className="mt-4 inline-block text-hunter hover:underline">
            Grįžti į užsakymų sąrašą
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Užsakymo Detalės
              </h1>
              <p className="text-sm text-gray-500">
                Užsakymo ID: {booking.id}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
              {getStatusText(booking.status)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Užsakymo Informacija</h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
                    <p className="text-sm text-gray-500">Data</p>
                    <p className="font-medium">{format(booking.date, 'PPP', { locale: lt })}</p>
            </div>
            <div>
                    <p className="text-sm text-gray-500">Laikas</p>
                    <p className="font-medium">{booking.timeSlot.start} - {booking.timeSlot.end}</p>
            </div>
            <div>
                    <p className="text-sm text-gray-500">Vieta</p>
                    <p className="font-medium">{booking.location}</p>
            </div>
            <div>
                    <p className="text-sm text-gray-500">Svečių skaičius</p>
                    <p className="font-medium">{booking.guests} asm.</p>
            </div>
          </div>
        </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Pasirinkta Tema</h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
                    <p className="text-sm text-gray-500">Pavadinimas</p>
                    <p className="font-medium">{booking.themeName}</p>
            </div>
            <div>
                    <p className="text-sm text-gray-500">Kaina</p>
                    <p className="font-medium">{booking.themePrice} €</p>
                  </div>
            </div>
          </div>
        </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Kliento Informacija</h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Vardas ir pavardė</p>
                    <p className="font-medium">{booking.contactInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">El. paštas</p>
                    <p className="font-medium">{booking.contactInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefono numeris</p>
                    <p className="font-medium">{booking.contactInfo.phone}</p>
                  </div>
                </div>
              </div>

        {booking.specialRequests && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Papildomi Pageidavimai</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{booking.specialRequests}</p>
                  </div>
          </div>
        )}

              <div>
                <h2 className="text-lg font-semibold mb-4">Užsakymo Istorija</h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Sukurta</p>
                    <p className="font-medium">{format(booking.createdAt, 'PPP HH:mm', { locale: lt })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Paskutinį kartą atnaujinta</p>
                    <p className="font-medium">{format(booking.updatedAt, 'PPP HH:mm', { locale: lt })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link
              href="/admin/bookings"
              className="btn-secondary w-full sm:w-auto text-center"
            >
              Grįžti į sąrašą
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {booking.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusChange('confirmed')}
                    disabled={updating}
                    className="btn-success w-full sm:w-auto"
                >
                    {updating ? 'Tvirtinama...' : 'Patvirtinti užsakymą'}
                </button>
                <button
                    onClick={() => handleStatusChange('cancelled')}
                    disabled={updating}
                    className="btn-danger w-full sm:w-auto"
                >
                    {updating ? 'Atšaukiama...' : 'Atšaukti užsakymą'}
                </button>
              </>
            )}
            {booking.status === 'confirmed' && (
              <button
                onClick={() => handleStatusChange('completed')}
                  disabled={updating}
                  className="btn-primary w-full sm:w-auto"
              >
                  {updating ? 'Žymima...' : 'Pažymėti kaip įvykdytą'}
              </button>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 