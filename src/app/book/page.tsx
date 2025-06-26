'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { DateSelectArg, EventClickArg } from '@fullcalendar/core'

// Lazy load heavy components
const Calendar = dynamic(() => import('@/components/booking/Calendar'), {
  loading: () => <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" />
})

const BookingForm = dynamic(() => import('@/components/booking/BookingForm'), {
  loading: () => <div className="h-[300px] animate-pulse bg-gray-100 rounded-lg" />
})

const AddOns = dynamic(() => import('@/components/booking/AddOns'), {
  loading: () => <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" />
})

export default function BookPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const startDate = new Date(selectInfo.start)
    setSelectedDate(startDate)
    // Here we'll add logic to show booking form or time slots
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    // Here we'll add logic to handle clicking on existing bookings
  }

  // Example events - we'll replace these with real data from Firebase later
  const events = [
    {
      title: 'Booked',
      start: '2024-03-20T10:00:00',
      end: '2024-03-20T12:00:00',
    },
    {
      title: 'Booked',
      start: '2024-03-22T14:00:00',
      end: '2024-03-22T16:00:00',
    },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Book Your Picnic Experience</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Suspense 
            fallback={<div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" />}
          >
            <Calendar
              onDateSelect={handleDateSelect}
              onEventClick={handleEventClick}
              events={events}
            />
          </Suspense>
          
          <Suspense
            fallback={<div className="h-[300px] animate-pulse bg-gray-100 rounded-lg" />}
          >
            <BookingForm />
          </Suspense>
        </div>
        
        <Suspense
          fallback={<div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" />}
        >
          <AddOns />
        </Suspense>
      </div>
    </div>
  )
} 