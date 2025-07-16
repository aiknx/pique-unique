'use client';

import { useSearchParams } from 'next/navigation';
import BookingForm from '@/components/booking/BookingForm';

export default function BookingFormPage() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const locationParam = searchParams.get('location');
  const timeStartParam = searchParams.get('timeStart');
  const timeEndParam = searchParams.get('timeEnd');
  const themeParam = searchParams.get('theme');

  if (!dateParam || !locationParam || !timeStartParam || !timeEndParam) {
    return (
      <div className="min-h-screen bg-linen py-12">
        <div className="container-custom">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-hunter mb-8">Klaida</h1>
            <p className="text-gray-600">Trūksta reikalingų duomenų rezervacijai.</p>
            <button
              onClick={() => window.history.back()}
              className="mt-6 btn-secondary"
            >
              Grįžti atgal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedDate = new Date(dateParam);
  const selectedLocation = locationParam;
  const selectedTimeSlot = { 
    start: timeStartParam, 
    end: timeEndParam 
  };
  const selectedTheme = themeParam;

  return (
    <div className="min-h-screen bg-linen py-12">
      <div className="container-custom">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-hunter mb-8">Užpildykite rezervacijos formą</h1>
          <BookingForm 
            selectedDate={selectedDate}
            selectedLocation={selectedLocation}
            selectedTimeSlot={selectedTimeSlot}
            selectedTheme={selectedTheme}
          />
        </div>
      </div>
    </div>
  );
} 