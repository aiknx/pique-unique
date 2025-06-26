import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { DateSelectArg, EventClickArg } from '@fullcalendar/core'

interface CalendarProps {
  onDateSelect?: (selectInfo: DateSelectArg) => void
  onEventClick?: (clickInfo: EventClickArg) => void
  events?: any[]
}

export default function Calendar({ onDateSelect, onEventClick, events = [] }: CalendarProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Add custom styles for calendar
      const style = document.createElement('style')
      style.innerHTML = `
        .fc {
          --fc-border-color: #EFE4DB;
          --fc-neutral-bg-color: #F4F4F4;
          font-family: var(--font-inter);
        }
        .fc-button-primary {
          background-color: #779E7B !important;
          border-color: #779E7B !important;
          color: #F4F4F4 !important;
        }
        .fc-button-primary:hover {
          background-color: #466D4B !important;
          border-color: #466D4B !important;
        }
        .fc-button-active {
          background-color: #3CA6A6 !important;
          border-color: #3CA6A6 !important;
        }
        .fc-day-today {
          background-color: #EFE4DB !important;
        }
        .fc-event {
          background-color: #CB7286 !important;
          border-color: #CB7286 !important;
          padding: 2px 4px;
        }
        .fc-event:hover {
          background-color: #E9A6B3 !important;
          border-color: #E9A6B3 !important;
        }
        .fc-day-sat, .fc-day-sun {
          background-color: #F4F4F4;
        }
        .fc th {
          padding: 12px 0;
          background-color: #779E7B;
          color: #F4F4F4;
          font-weight: 500;
        }
        .fc td {
          border-color: #EFE4DB;
        }
        .fc-toolbar-title {
          color: #466D4B;
        }
        .fc-highlight {
          background-color: rgba(60, 166, 166, 0.2) !important;
        }
      `
      document.head.appendChild(style)
      setIsLoading(false)
      return () => {
        document.head.removeChild(style)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize calendar')
      setIsLoading(false)
    }
  }, [])

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg text-red-600">
        <p>Error loading calendar: {error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4 bg-linen rounded-lg shadow-lg flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hunter"></div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-linen rounded-lg shadow-lg">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={events}
        select={onDateSelect}
        eventClick={onEventClick}
        height="auto"
        contentHeight="auto"
        aspectRatio={2}
        firstDay={1} // Week starts on Monday
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week'
        }}
        slotMinTime="09:00:00" // Day starts at 9 AM
        slotMaxTime="21:00:00" // Day ends at 9 PM
        allDaySlot={false}
        slotDuration="01:00:00"
        locale="en-GB"
      />
    </div>
  )
} 