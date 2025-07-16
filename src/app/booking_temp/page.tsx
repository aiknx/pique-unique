// BACKUP FILE - Preserved for reference
// Original location: src/app/booking_temp/page.tsx

'use client';

import { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { lt } from 'date-fns/locale';
import WeatherWidget from '@/components/WeatherWidget';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('klaipeda');
  const { user } = useAuth();
  const router = useRouter();

  const locations = [
    { id: 'klaipeda', name: 'Klaipėda' },
    { id: 'juodkrante', name: 'Juodkrantė' },
    { id: 'nida', name: 'Nida' },
  ];

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleContinue = () => {
    if (!user) {
      // If not logged in, redirect to login with return URL
      router.push(`/signin?from=/book?date=${selectedDate?.toISOString()}&location=${selectedLocation}`);
      return;
    }
    // If logged in, proceed to booking form
    router.push(`/book?date=${selectedDate?.toISOString()}&location=${selectedLocation}`);
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
                      onClick={() => setSelectedLocation(location.id)}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        selectedLocation === location.id
                          ? 'bg-hunter text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {location.name}
                    </button>
                  ))}
                </div>
                <WeatherWidget location={selectedLocation} date={selectedDate} />
              </div>
            </div>

            {/* Calendar Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Pasirinkite datą</h2>
              <div className="bg-white rounded-lg">
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={lt}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 90 days from now
                    views={['day']}
                    className="w-full"
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>

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
              disabled={!selectedDate || !selectedLocation}
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