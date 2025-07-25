'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

interface Booking {
  id: string;
  location: string;
  date: string;
  theme: string;
  time: string;
  guestCount: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  additionalServices?: string[];
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

const LOCATIONS = {
  'juodkrante': 'Juodkrantė',
  'nida': 'Nida',
  'klaipeda': 'Klaipėda',
  'palanga': 'Palanga',
  'svencele': 'Svencelė',
  'other': 'Kita vieta'
};

const THEMES = {
  'undiniu': 'Undinių',
  'feju': 'Fejų',
  'laumiu': 'Laumių',
  'disco': 'Disco'
};

const TIME_SLOTS = {
  '10:00': '10:00 - 13:00 (Rytas)',
  '14:00': '14:00 - 17:00 (Popietė)',
  '18:00': '18:00 - 21:00 (Vakaras)'
};

const STATUS_LABELS = {
  'pending': { label: 'Laukia patvirtinimo', color: 'bg-yellow-100 text-yellow-800' },
  'confirmed': { label: 'Patvirtinta', color: 'bg-green-100 text-green-800' },
  'cancelled': { label: 'Atšaukta', color: 'bg-red-100 text-red-800' },
  'completed': { label: 'Užbaigta', color: 'bg-blue-100 text-blue-800' }
};

const PAYMENT_STATUS_LABELS = {
  'pending': { label: 'Mokėjimas vietoje', color: 'bg-blue-100 text-blue-800' },
  'paid': { label: 'Apmokėta', color: 'bg-green-100 text-green-800' },
  'refunded': { label: 'Grąžinta', color: 'bg-gray-100 text-gray-800' }
};

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const idToken = await user?.getIdToken();
      const response = await fetch('/api/user/bookings', {
        headers: {
          ...(idToken && { 'Authorization': `Bearer ${idToken}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Nepavyko gauti užsakymų');
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Nepavyko gauti užsakymų');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin?from=/my-bookings');
      return;
    }

    if (user) {
      fetchBookings();
    }
  }, [user, authLoading, router, fetchBookings]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('lt-LT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-linen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-linen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-hunter mb-4">
            Mano Užsakymai
          </h1>
          <p className="text-gray-600">
            Peržiūrėkite savo piknikų rezervacijas ir jų būseną
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter mx-auto"></div>
            <p className="mt-4 text-gray-600">Kraunama...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Bandyti dar kartą
            </button>
          </div>
        )}

        {/* No Bookings */}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Neturite užsakymų
            </h2>
            <p className="text-gray-600 mb-6">
              Jūs dar neturite jokių piknikų rezervacijų
            </p>
            <button
              onClick={() => router.push('/booking')}
              className="bg-hunter text-white px-6 py-3 rounded-lg hover:bg-hunter-dark transition-colors"
            >
              Rezervuoti Pikniką
            </button>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {LOCATIONS[booking.location as keyof typeof LOCATIONS] || booking.location}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_LABELS[booking.status as keyof typeof STATUS_LABELS]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {STATUS_LABELS[booking.status as keyof typeof STATUS_LABELS]?.label || booking.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${PAYMENT_STATUS_LABELS[booking.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS]?.color || 'bg-gray-100 text-gray-800'}`}>
                        {PAYMENT_STATUS_LABELS[booking.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS]?.label || booking.paymentStatus}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {formatDate(booking.date)} • {TIME_SLOTS[booking.time as keyof typeof TIME_SLOTS] || booking.time}
                    </p>
                  </div>
                  <div className="text-right mt-4 lg:mt-0">
                    <p className="text-2xl font-bold text-hunter">
                      {booking.totalPrice} €
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.guestCount} {booking.guestCount === 1 ? 'svečias' : 'svečiai'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Rezervacijos detalės</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Tema:</span> {THEMES[booking.theme as keyof typeof THEMES] || booking.theme}</p>
                      <p><span className="font-medium">Vieta:</span> {LOCATIONS[booking.location as keyof typeof LOCATIONS] || booking.location}</p>
                      <p><span className="font-medium">Data:</span> {formatDate(booking.date)}</p>
                      <p><span className="font-medium">Laikas:</span> {TIME_SLOTS[booking.time as keyof typeof TIME_SLOTS] || booking.time}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Kontaktinė informacija</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Vardas:</span> {booking.contactInfo.name}</p>
                      <p><span className="font-medium">El. paštas:</span> {booking.contactInfo.email}</p>
                      <p><span className="font-medium">Telefonas:</span> {booking.contactInfo.phone}</p>
                    </div>
                  </div>
                </div>

                {booking.additionalServices && booking.additionalServices.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Papildomos paslaugos</h4>
                    <div className="flex flex-wrap gap-2">
                      {booking.additionalServices.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-cambridge-blue text-white rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {booking.specialRequests && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Papildomi pageidavimai</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
                    <div>
                      <p>Užsakymas sukurtas: {formatDateTime(booking.createdAt)}</p>
                      {booking.updatedAt !== booking.createdAt && (
                        <p>Atnaujinta: {formatDateTime(booking.updatedAt)}</p>
                      )}
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <p>Užsakymo ID: {booking.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Booking Button */}
        {!loading && !error && bookings.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/booking')}
              className="bg-hunter text-white px-6 py-3 rounded-lg hover:bg-hunter-dark transition-colors"
            >
              Rezervuoti Naują Pikniką
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 