'use client';

import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, orderBy, getDocs, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase/schema';
import { format } from 'date-fns';
import { lt } from 'date-fns/locale';

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

export default function BookingsPage() {
  // const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek'>('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create base query
        let baseQuery = query(
          collection(db, COLLECTIONS.BOOKINGS),
          orderBy('date', 'asc')
        );

        // Add status filter if not 'all'
        if (statusFilter !== 'all') {
          baseQuery = query(baseQuery, where('status', '==', statusFilter));
        }

        const querySnapshot = await getDocs(baseQuery);
        
        let fetchedBookings = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate()
          } as Booking;
        });

        // Apply date filter in memory (since Firestore doesn't support complex date queries well)
        if (dateFilter !== 'all') {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);

          fetchedBookings = fetchedBookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            bookingDate.setHours(0, 0, 0, 0);

            switch (dateFilter) {
              case 'today':
                return bookingDate.getTime() === today.getTime();
              case 'tomorrow':
                return bookingDate.getTime() === tomorrow.getTime();
              case 'thisWeek':
                return bookingDate >= today && bookingDate < nextWeek;
              case 'nextWeek':
                const weekAfter = new Date(nextWeek);
                weekAfter.setDate(weekAfter.getDate() + 7);
                return bookingDate >= nextWeek && bookingDate < weekAfter;
              default:
                return true;
            }
          });
        }

        setBookings(fetchedBookings);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Įvyko klaida gaunant užsakymų sąrašą');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [statusFilter, dateFilter]);

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const bookingRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: new Date()
      });

      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
      booking.id === bookingId 
            ? { ...booking, status: newStatus, updatedAt: new Date() }
        : booking
        )
      );
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Nepavyko atnaujinti užsakymo statuso');
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p className="font-bold">Klaida!</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Užsakymų Valdymas
        </h1>
        <div className="flex gap-4">
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
          >
            <option value="all">Visos datos</option>
            <option value="today">Šiandien</option>
            <option value="tomorrow">Rytoj</option>
            <option value="thisWeek">Šią savaitę</option>
            <option value="nextWeek">Kitą savaitę</option>
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-hunter focus:ring-hunter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}
          >
            <option value="all">Visi statusai</option>
            <option value="pending">Laukiantys</option>
            <option value="confirmed">Patvirtinti</option>
            <option value="cancelled">Atšaukti</option>
            <option value="completed">Įvykdyti</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Klientas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data ir Laikas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tema
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Svečiai
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statusas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Veiksmai
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.contactInfo.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.contactInfo.phone}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.contactInfo.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(booking.date, 'PPP', { locale: lt })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.timeSlot.start} - {booking.timeSlot.end}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {booking.themeName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.themePrice} €
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.guests} asm.
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col space-y-2">
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="text-hunter hover:text-hunter-dark"
                    >
                      Peržiūrėti
                    </Link>
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Patvirtinti
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Atšaukti
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Pažymėti kaip įvykdytą
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Nerasta užsakymų pagal pasirinktus filtrus
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 