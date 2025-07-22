'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';
import { lt } from 'date-fns/locale';
import Link from 'next/link';

interface Booking {
  id: string;
  date: string;
  timeSlot: {
    start: string;
    end: string;
  };
  location: string;
  guests: number;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  themeName: string;
  themePrice: number;
  status: string;
  createdAt: string;
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    try {
      setLoading(true);
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingDoc = await getDoc(bookingRef);

      if (bookingDoc.exists()) {
        const data = bookingDoc.data();
        setBooking({
          id: bookingDoc.id,
          date: data.date.toDate ? data.date.toDate().toISOString().split('T')[0] : data.date,
          timeSlot: data.timeSlot,
          location: data.location,
          guests: data.guests,
          contactInfo: data.contactInfo,
          specialRequests: data.specialRequests,
          themeName: data.themeName,
          themePrice: data.themePrice,
          status: data.status,
          createdAt: data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
        });
      } else {
        setError('Rezervacija nerasta');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      setError('Įvyko klaida gaunant rezervacijos informaciją');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, fetchBooking]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Laukia patvirtinimo';
      case 'confirmed':
        return 'Patvirtinta';
      case 'cancelled':
        return 'Atšaukta';
      case 'completed':
        return 'Užbaigta';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter mx-auto"></div>
          <p className="mt-4 text-gray-600">Kraunama rezervacijos informacija...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || 'Rezervacija nerasta'}
          </div>
          <Link
            href="/booking"
            className="bg-hunter text-white px-6 py-3 rounded-lg hover:bg-hunter-dark transition-colors"
          >
            Grįžti į rezervaciją
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-hunter text-white px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Rezervacija gauta!</h1>
            <p className="text-lg opacity-90">
              Jūsų rezervacijos numeris: <strong>{booking.id}</strong>
            </p>
          </div>

          {/* Status */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Statusas:</span>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                {getStatusText(booking.status)}
              </span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Rezervacijos informacija</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Data ir laikas</h3>
                    <p className="text-gray-700">
                      {format(new Date(booking.date), 'EEEE, yyyy-MM-dd', { locale: lt })}
                    </p>
                    <p className="text-gray-700">
                      {booking.timeSlot.start} - {booking.timeSlot.end}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Vieta</h3>
                    <p className="text-gray-700">{booking.location}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Svečių skaičius</h3>
                    <p className="text-gray-700">{booking.guests} žmonių</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Pikniko tema</h3>
                    <p className="text-gray-700">{booking.themeName}</p>
                    <p className="text-gray-700 font-semibold">{booking.themePrice}€</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Kontaktinė informacija</h3>
                    <p className="text-gray-700">{booking.contactInfo.name}</p>
                    <p className="text-gray-700">{booking.contactInfo.email}</p>
                    <p className="text-gray-700">{booking.contactInfo.phone}</p>
                  </div>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Papildomi pageidavimai</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {booking.specialRequests}
                  </p>
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Kiti žingsniai</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• Jūsų rezervacija bus peržiūrėta per 24 valandas</p>
                <p>• Patvirtinimo laiškas bus išsiųstas el. paštu</p>
                <p>• Jei turite klausimų, susisiekite su mumis</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                href="/"
                className="flex-1 bg-hunter text-white px-6 py-3 rounded-lg hover:bg-hunter-dark transition-colors text-center"
              >
                Grįžti į pagrindinį puslapį
              </Link>
              <Link
                href="/booking"
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Nauja rezervacija
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 