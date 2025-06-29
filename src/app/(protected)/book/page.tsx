'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { DateSelectArg } from '@fullcalendar/core'

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.start)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-hunter mb-8">Book Your Picnic Experience</h1>
      
      <div className="space-y-8">
        <Calendar onDateSelect={handleDateSelect} />
        
        {selectedDate && (
          <>
            <BookingForm selectedDate={selectedDate} />
            <AddOns />
          </>
        )}
      </div>
    </div>
  )
} 