'use client';

import { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { lt } from 'date-fns/locale';
import WeatherWidget from '@/components/WeatherWidget';

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('klaipeda');

  const locations = [
    { id: 'klaipeda', name: 'Klaipėda' },
    { id: 'juodkrante', name: 'Juodkrantė' },
    { id: 'nida', name: 'Nida' },
  ];

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-linen py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-bold text-hunter-green mb-8 text-center">
          Rezervuoti pikniką
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Location Selection */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Pasirinkite vietą</h2>
              <div className="flex flex-col gap-3">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => setSelectedLocation(location.id)}
                    className={`p-4 rounded-lg text-left transition-colors ${
                      selectedLocation === location.id
                        ? 'bg-hunter-green text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {location.name}
                  </button>
                ))}
              </div>

              {/* Weather Information */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Orai</h2>
                <WeatherWidget location={selectedLocation} date={selectedDate} />
              </div>
            </div>

            {/* Calendar */}
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
              onClick={() => {
                // TODO: Implement booking logic
                console.log('Booking:', { date: selectedDate, location: selectedLocation });
              }}
            >
              Tęsti rezervaciją
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 