'use client';

import dynamic from 'next/dynamic';

const MultistepBookingForm = dynamic(() => import('@/components/booking/MultistepBookingForm'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-64 mx-auto mb-4"></div>
          <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-96 mx-auto mb-8"></div>
          <div className="animate-pulse bg-gray-200 rounded-lg h-96 w-full"></div>
        </div>
      </div>
    </div>
  )
});

export default function BookingPage() {
  return <MultistepBookingForm />;
} 