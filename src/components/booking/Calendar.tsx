'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, parseISO } from 'date-fns';
import { lt } from 'date-fns/locale';

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  location?: string;
  className?: string;
}

export default function Calendar({ selectedDate, onDateSelect, location = 'klaipeda', className = '' }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Use useMemo to prevent unnecessary recalculations
  const monthStart = useMemo(() => startOfMonth(currentMonth), [currentMonth]);
  const monthEnd = useMemo(() => endOfMonth(currentMonth), [currentMonth]);
  const days = useMemo(() => eachDayOfInterval({ start: monthStart, end: monthEnd }), [monthStart, monthEnd]);

  const handlePrevMonth = useCallback(() => setCurrentMonth(subMonths(currentMonth, 1)), [currentMonth]);
  const handleNextMonth = useCallback(() => setCurrentMonth(addMonths(currentMonth, 1)), [currentMonth]);

  const isDateSelectable = useCallback((date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isBefore(date, today);
  }, []);

  // Fetch only booked dates with proper debouncing
  useEffect(() => {
    let isMounted = true;

    const fetchBookedDates = async () => {
      if (!location) return;

      setIsLoading(true);
      try {
        const startDate = format(monthStart, 'yyyy-MM-dd');
        const endDate = format(monthEnd, 'yyyy-MM-dd');
        
        const bookedResponse = await fetch(`/api/booked-dates?location=${location}&startDate=${startDate}&endDate=${endDate}`);
        if (bookedResponse.ok && isMounted) {
          const bookedData = await bookedResponse.json();
          setBookedDates(new Set(bookedData.bookedDates || []));
        }
      } catch (error) {
        console.error('Error fetching booked dates:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Proper debouncing with 500ms delay
    timeoutRef.current = setTimeout(fetchBookedDates, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      isMounted = false;
    };
  }, [location, monthStart, monthEnd]);

  const handleDateClick = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    onDateSelect(dateStr);
  }, [onDateSelect]);

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-600"
          disabled={isLoading}
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: lt })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-600"
          disabled={isLoading}
        >
          →
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1 }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const isSelectable = isDateSelectable(day);
          const isSelected = selectedDate && isSameDay(day, parseISO(selectedDate));
          const dateStr = format(day, 'yyyy-MM-dd');
          const isBooked = bookedDates.has(dateStr);
          const isToday = isSameDay(day, new Date());
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => isSelectable && !isBooked && handleDateClick(day)}
              disabled={!isSelectable || isBooked || isLoading}
              className={`
                aspect-square p-1 text-xs rounded transition-colors relative
                ${isLoading ? 'opacity-50' : ''}
                ${isBooked
                  ? 'bg-red-100 text-red-600 cursor-not-allowed border border-red-300'
                  : isSelectable 
                    ? isSelected
                      ? 'bg-blue-600 text-white'
                      : isToday
                        ? 'bg-blue-100 text-blue-900 hover:bg-blue-600 hover:text-white border border-blue-300'
                        : 'bg-white text-gray-900 hover:bg-blue-600 hover:text-white border border-gray-200'
                    : 'cursor-not-allowed opacity-50'
                }
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="font-medium">{format(day, 'd')}</span>
                
                {/* Booked indicator */}
                {isBooked && (
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                )}
                
                {/* Today indicator */}
                {isToday && !isBooked && !isSelected && (
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 text-xs text-gray-600">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Šiandien</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-100 border border-red-300 rounded"></div>
            <span>Užimta</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded"></div>
            <span>Pasirinkta</span>
          </div>
        </div>
      </div>
    </div>
  );
} 