'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamic imports with proper loading states
const WeatherWidget = dynamic(() => import('@/components/WeatherWidget'), {
  loading: () => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
});

const TimeSlots = dynamic(() => import('@/components/booking/TimeSlots'), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full"></div>
  )
});

const Calendar = dynamic(() => import('@/components/booking/Calendar'), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 rounded-lg h-32 w-full"></div>
  )
});

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('klaipeda');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeParam = searchParams.get('theme');

  const locations = [
    { id: 'klaipeda', name: 'Klaipėda' },
    { id: 'juodkrante', name: 'Juodkrantė' },
    { id: 'nida', name: 'Nida' },
  ];

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  const handleTimeSlotSelect = (timeSlot: { start: string; end: string }) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleContinue = () => {
    // Proceed directly to booking form
    const params = new URLSearchParams({
      date: selectedDate?.toISOString() || '',
      location: selectedLocation,
      timeStart: selectedTimeSlot?.start || '',
      timeEnd: selectedTimeSlot?.end || '',
      ...(themeParam && { theme: themeParam })
    });
    router.push(`/booking/form?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-linen py-12">
      <div className="container-custom">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-hunter mb-8">Rezervuokite savo pikniką</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Weather Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Pasirinkite vietą</h2>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {locations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => {
                        setSelectedLocation(location.id);
                        setSelectedTimeSlot(null);
                      }}
                      className={`
                        p-4 rounded-lg border transition-all
                        ${selectedLocation === location.id
                          ? 'bg-green-700 text-white border-green-800 hover:bg-green-800'
                          : 'bg-white text-gray-900 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="text-center">
                        <span className="block font-medium">
                          {location.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <WeatherWidget 
                  location={selectedLocation} 
                  date={selectedDate} 
                />
              </div>
            </div>

            {/* Calendar Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Pasirinkite datą</h2>
              <div className="bg-white rounded-lg">
                <Calendar
                  selectedDate={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
                  location={selectedLocation}
                />
              </div>
            </div>
          </div>

          {/* Time Slots Section */}
          {selectedDate && (
            <div className="mt-8">
              <TimeSlots
                selectedDate={selectedDate}
                selectedLocation={selectedLocation}
                onSelect={handleTimeSlotSelect}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              className="btn-secondary"
              onClick={() => window.history.back()}
            >
              Grįžti atgal
            </button>
            <button
              className="btn-primary"
              disabled={!selectedDate || !selectedLocation || !selectedTimeSlot}
              onClick={handleContinue}
            >
              Tęsti rezervaciją
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 