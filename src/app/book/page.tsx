// BACKUP FILE - Preserved for reference
// Original location: src/app/book/page.tsx

'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Lazy load heavy components with no SSR
const Calendar = dynamic(() => import('@/components/booking/Calendar'), {
  ssr: false,
  loading: () => <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" />
})

const BookingForm = dynamic(() => import('@/components/booking/BookingForm'), {
  ssr: false,
  loading: () => <div className="h-[300px] animate-pulse bg-gray-100 rounded-lg" />
})

const AddOns = dynamic(() => import('@/components/booking/AddOns'), {
  ssr: false,
  loading: () => <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" />
})

export default function BookPage() {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const selectedTimeSlot = { start: '14:00', end: '17:00' }
  const location = 'klaipeda' // Fiksuota lokacija

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
  }

  return (
    <div className="container-custom py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-hunter mb-8">Užbaigti Rezervaciją</h1>
        
        <div className="space-y-8">
          <Calendar 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            location={location}
          />
          
          {selectedDate && (
            <>
              <BookingForm 
                selectedDate={new Date(selectedDate)}
                selectedLocation={location}
                selectedTimeSlot={selectedTimeSlot}
              />
              <AddOns />
            </>
          )}
        </div>
      </div>
    </div>
  )
} 