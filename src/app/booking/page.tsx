'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import WeatherWidget from '@/components/WeatherWidget';
import ThemeSelection from '@/components/booking/ThemeSelection';

// Dynamic imports with proper loading states
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

const TIME_SLOTS = {
  '10:00': { start: '10:00', end: '13:00', label: 'Rytas' },
  '14:00': { start: '14:00', end: '17:00', label: 'Popietė' },
  '18:00': { start: '18:00', end: '21:00', label: 'Vakaras' }
} as const;

const LOCATIONS = [
  { id: 'juodkrante', name: 'Juodkrantė', description: 'Neringos miesto savivaldybė' },
  { id: 'nida', name: 'Nida', description: 'Neringos miesto savivaldybė' },
  { id: 'klaipeda', name: 'Klaipėda', description: 'Klaipėdos miesto savivaldybė' },
  { id: 'palanga', name: 'Palanga', description: 'Palangos miesto savivaldybė' },
  { id: 'svencele', name: 'Svencelė', description: 'Klaipėdos rajono savivaldybė' },
  { id: 'other', name: 'Kita vieta *', description: 'Pagal individualų užsakymą' }
];

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'juodkrante');
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || '');
  const [selectedTheme, setSelectedTheme] = useState(searchParams.get('theme') || '');
  const [selectedTime, setSelectedTime] = useState(searchParams.get('time') || '');
  const [currentStep, setCurrentStep] = useState<'location' | 'date' | 'theme' | 'time'>('location');

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setSelectedDate('');
    setSelectedTheme('');
    setSelectedTime('');
    // NEpereiname automatiškai - paliekame vartotoją spausti "Toliau"
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // NEpereiname automatiškai - paliekame vartotoją pamatyti orus
  };

  const handleDateContinue = () => {
    if (selectedDate) {
      setCurrentStep('theme');
    }
  };

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    // NEpereiname automatiškai - paliekame vartotoją spausti "Toliau"
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    const params = new URLSearchParams({
      location: selectedLocation,
      date: selectedDate,
      theme: selectedTheme,
      time: selectedTime
    });
    router.push(`/booking/confirmation?${params.toString()}`);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'date':
        setCurrentStep('location');
        break;
      case 'theme':
        setCurrentStep('date');
        break;
      case 'time':
        setCurrentStep('theme');
        break;
      default:
        window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rezervuokite Pikniką
          </h1>
          <p className="text-lg text-gray-600">
            Pasirinkite vietą, datą, temą ir laiką savo puikiam piknikui
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {[
              { key: 'location', label: 'Vieta', active: currentStep === 'location' || currentStep === 'date' || currentStep === 'theme' || currentStep === 'time' },
              { key: 'date', label: 'Data', active: currentStep === 'date' || currentStep === 'theme' || currentStep === 'time' },
              { key: 'theme', label: 'Tema', active: currentStep === 'theme' || currentStep === 'time' },
              { key: 'time', label: 'Laikas', active: currentStep === 'time' }
            ].map(({ key, label, active }) => (
              <div key={key} className={`flex items-center ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {key === 'location' ? '1' : key === 'date' ? '2' : key === 'theme' ? '3' : '4'}
                </div>
                <span className="ml-2 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Location Selection */}
            {currentStep === 'location' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Pasirinkite vietą</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LOCATIONS.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelect(location.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedLocation === location.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900">{location.name}</h3>
                      <p className="text-sm text-gray-600">{location.description}</p>
                    </button>
                  ))}
                </div>
                
                {/* Continue button for location step */}
                {selectedLocation && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setCurrentStep('date')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
                    >
                      Toliau
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Date Selection */}
            {currentStep === 'date' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Pasirinkite datą</h2>
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  location={selectedLocation}
                  className="max-w-md mx-auto"
                />
                
                {/* Continue button for date step */}
                {selectedDate && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleDateContinue}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
                    >
                      Toliau
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Theme Selection */}
            {currentStep === 'theme' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Pasirinkite temą</h2>
                <ThemeSelection
                  selectedTheme={selectedTheme}
                  onThemeSelect={handleThemeSelect}
                />
                
                {/* Continue button for theme step */}
                {selectedTheme && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setCurrentStep('time')}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
                    >
                      Toliau
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Time Selection */}
            {currentStep === 'time' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Pasirinkite laiką</h2>
                <TimeSlots
                  selectedTime={selectedTime}
                  onTimeSelect={handleTimeSelect}
                  date={selectedDate}
                  location={selectedLocation}
                />
                
                {/* Continue button for time step */}
                {selectedTime && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleContinue}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
                    >
                      Tęsti rezervaciją
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons - Only Back button */}
            <div className="flex justify-start">
              <button
                onClick={handleBack}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Grįžti atgal
              </button>
            </div>
          </div>

          {/* Right Column - Weather and Summary */}
          <div className="space-y-6">
            {/* Weather Widget */}
            {selectedLocation && selectedLocation !== 'other' && selectedDate && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Oro prognozė</h3>
                <WeatherWidget location={selectedLocation} date={selectedDate} />
              </div>
            )}

            {/* Booking Summary */}
            {(selectedLocation || selectedDate || selectedTheme || selectedTime) && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Rezervacijos santrauka</h3>
                <div className="space-y-3 text-sm">
                  {selectedLocation && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vieta:</span>
                      <span className="font-medium">
                        {LOCATIONS.find(l => l.id === selectedLocation)?.name}
                      </span>
                    </div>
                  )}
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data:</span>
                      <span className="font-medium">
                        {new Date(selectedDate).toLocaleDateString('lt-LT')}
                      </span>
                    </div>
                  )}
                  {selectedTheme && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tema:</span>
                      <span className="font-medium">{selectedTheme}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Laikas:</span>
                      <span className="font-medium">
                        {TIME_SLOTS[selectedTime as keyof typeof TIME_SLOTS]?.label} ({selectedTime})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 