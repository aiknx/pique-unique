'use client';

import { useState, useEffect, useRef } from 'react';

interface TimeSlotsProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  date: string;
  location: string;
}

const DEFAULT_TIME_SLOTS = [
  { start: '10:00', end: '13:00', label: 'Rytas' },
  { start: '14:00', end: '17:00', label: 'Popietė' },
  { start: '18:00', end: '21:00', label: 'Vakaras' }
];

export default function TimeSlots({ selectedTime, onTimeSelect, date, location }: TimeSlotsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!date || !location) {
      setBookedSlots([]);
      setError(null);
      return;
    }

    // Clear previous timeout and abort previous request
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const fetchBookedSlots = async () => {
      setLoading(true);
      setError(null);
      
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      try {
        const response = await fetch(
          `/api/booked-slots?location=${location}&date=${date}`,
          { signal: abortControllerRef.current.signal }
        );
        
        if (!response.ok) {
          throw new Error('Nepavyko gauti užimtų laikų');
        }
        
        const data = await response.json();
        setBookedSlots(data.bookedSlots || []);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was aborted, don't set error
          return;
        }
        console.error('Error fetching booked slots:', err);
        setError('Nepavyko gauti užimtų laikų');
      } finally {
        setLoading(false);
      }
    };

    // Increased debouncing to 1000ms to prevent excessive API calls
    timeoutRef.current = setTimeout(fetchBookedSlots, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [date, location]);

  const handleSlotSelect = (timeSlot: string) => {
    onTimeSelect(timeSlot);
  };

  if (!date) {
    return (
      <div className="text-center text-gray-500 py-8">
        Pasirinkite datą, kad pamatytumėte laikus
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loading && (
        <div className="animate-pulse space-y-3">
          {DEFAULT_TIME_SLOTS.map((_, index) => (
            <div key={index} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-center">{error}</div>
      )}
      
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEFAULT_TIME_SLOTS.map((slot) => {
            const isBooked = bookedSlots.includes(slot.start);
            const isSelected = selectedTime === slot.start;
            
            return (
              <button
                key={slot.start}
                onClick={() => !isBooked && handleSlotSelect(slot.start)}
                disabled={isBooked}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200
                  ${isBooked
                    ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                    : isSelected
                      ? 'bg-blue-600 border-blue-700 text-white'
                      : 'bg-white border-gray-200 text-gray-900 hover:bg-blue-50 hover:border-blue-300'
                  }
                `}
              >
                <div className="text-center">
                  <div className="font-semibold">{slot.label}</div>
                  <div className="text-sm opacity-75">
                    {slot.start} - {slot.end}
                  </div>
                  {isBooked && (
                    <div className="text-xs mt-1 font-medium text-red-600">Užimta</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
} 