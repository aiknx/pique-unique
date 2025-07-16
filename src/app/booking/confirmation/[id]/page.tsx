'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase/schema';
import Link from 'next/link';

interface Booking {
  id: string;
  date: { toDate: () => Date };
  timeSlot: { start: string; end: string };
  location: string;
  guests: number;
  themeName: string;
  themePrice: number;
  specialRequests?: string;
}

export default function BookingConfirmationPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const docRef = doc(db, COLLECTIONS.BOOKINGS, params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBooking({ id: docSnap.id, ...docSnap.data() } as Booking);
        } else {
          setError('Rezervacija nerasta');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Įvyko klaida gaunant rezervacijos informaciją');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          <Link href="/" className="mt-4 inline-block text-hunter hover:underline">
            Grįžti į pagrindinį puslapį
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rezervacija sėkminga!</h1>
          <p className="text-gray-600">
            Jūsų užsakymas buvo sėkmingai gautas. Netrukus su Jumis susisieks mūsų komandos narys.
            </p>
          </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Rezervacijos detalės</h2>
              
              <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Data</p>
                <p className="font-medium">{new Date(booking.date.toDate()).toLocaleDateString('lt-LT')}</p>
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
                    <p className="font-medium">{booking.guests}</p>
                  </div>
                </div>

                    <div>
              <p className="text-sm text-gray-500">Pasirinkta tema</p>
              <p className="font-medium">{booking.themeName}</p>
                    </div>

                    <div>
              <p className="text-sm text-gray-500">Kaina</p>
              <p className="font-medium">{booking.themePrice} €</p>
                </div>

                {booking.specialRequests && (
              <div>
                <p className="text-sm text-gray-500">Papildomi pageidavimai</p>
                <p className="font-medium">{booking.specialRequests}</p>
                  </div>
                )}
                  </div>
                </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Kas toliau?</h2>
          <div className="prose prose-hunter">
            <ul className="list-disc pl-4 space-y-2">
              <li>Netrukus gausite patvirtinimo el. laišką su rezervacijos detalia informacija.</li>
              <li>Mūsų komandos narys susisieks su Jumis per 24 valandas aptarti detalių.</li>
              <li>Jei turite klausimų, drąsiai kreipkitės į mus el. paštu arba telefonu.</li>
            </ul>
              </div>
            </div>

        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-hunter hover:bg-hunter-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hunter"
              >
                Grįžti į pagrindinį puslapį
          </Link>
        </div>
      </div>
    </div>
  );
} 