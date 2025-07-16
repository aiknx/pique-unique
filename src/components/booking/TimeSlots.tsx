'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase/schema';
import type { Booking } from '@/lib/firebase/schema';

interface TimeSlotsProps {
  selectedDate: Date;
  selectedLocation: string;
  onSelect: (timeSlot: { start: string; end: string }) => void;
}

const DEFAULT_TIME_SLOTS = [
  { start: '10:00', end: '13:00', label: 'Rytas' },
  { start: '14:00', end: '17:00', label: 'Diena' },
  { start: '18:00', end: '21:00', label: 'Vakaras' }
];

export default function TimeSlots({ selectedDate, selectedLocation, onSelect }: TimeSlotsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchBookedSlots = async () => {
      if (!selectedDate || !selectedLocation) return;

      setLoading(true);
      setError(null);
      
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const bookingsQuery = query(
          collection(db, COLLECTIONS.BOOKINGS),
          where('date', '>=', startOfDay),
          where('date', '<=', endOfDay),
          where('location', '==', selectedLocation),
          where('status', 'in', ['pending', 'confirmed'])
        );

        const snapshot = await getDocs(bookingsQuery);
        if (isMounted) {
          const booked = snapshot.docs.map(doc => {
            const booking = doc.data() as Booking;
            return booking.timeSlot.start;
          });
          setBookedSlots(booked);
        }
      } catch (err) {
        console.error('Error fetching booked slots:', err);
        if (isMounted) {
          setError('Nepavyko gauti užimtų laikų');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBookedSlots();
    return () => { isMounted = false; };
  }, [selectedDate, selectedLocation]);

  const handleSelect = (slot: { start: string; end: string }) => {
    setSelectedSlot(slot.start);
    onSelect(slot);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Pasirinkite laiką</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEFAULT_TIME_SLOTS.map((slot) => {
          const isBooked = bookedSlots.includes(slot.start);
          return (
            <button
              key={slot.start}
              onClick={() => !isBooked && handleSelect(slot)}
              disabled={isBooked}
              className={`
                p-6 rounded-lg border transition-all text-center
                ${isBooked
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : selectedSlot === slot.start
                    ? 'bg-green-700 text-white border-green-800'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }
              `}
            >
              <div className="space-y-2">
                <span className="block font-medium">{slot.label}</span>
                <span className="block text-sm">
                  {slot.start} - {slot.end}
                </span>
                {isBooked && (
                  <span className="block text-sm text-red-500">
                    Užimta
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
} 