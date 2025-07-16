'use client';

import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore } from 'date-fns';
import { lt } from 'date-fns/locale';

interface CalendarProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  minDate: Date;
  maxDate: Date;
}

export default function Calendar({ selectedDate, onChange, minDate, maxDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const isDateSelectable = (date: Date) => {
    return !isBefore(date, minDate) && !isAfter(date, maxDate);
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          disabled={isBefore(startOfMonth(currentMonth), startOfMonth(minDate))}
          className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'LLLL yyyy', { locale: lt })}
        </h2>
        <button
          onClick={handleNextMonth}
          disabled={isAfter(startOfMonth(currentMonth), startOfMonth(maxDate))}
          className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
        >
          →
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['P', 'A', 'T', 'K', 'Pn', 'Š', 'S'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1 }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const isSelectable = isDateSelectable(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => isSelectable && onChange(day)}
              disabled={!isSelectable}
              className={`
                aspect-square p-2 text-sm rounded-full transition-colors
                ${isSelectable 
                  ? isSelected
                    ? 'bg-hunter-green text-white'
                    : 'bg-white text-gray-900 hover:bg-hunter-green hover:text-white'
                  : 'cursor-not-allowed opacity-50'
                }
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
} 