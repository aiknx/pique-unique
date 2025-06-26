import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
}

export default function Calendar({ onDateSelect }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold">Select Date</h2>
      </div>
      
      <div className="border rounded-lg p-4 bg-white">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={{ before: new Date() }}
          className="mx-auto"
          classNames={{
            day_selected: "bg-primary text-white",
            day_today: "font-bold",
          }}
        />
      </div>

      {selectedDate && (
        <p className="text-sm text-gray-600">
          Selected date: {format(selectedDate, 'PPP')}
        </p>
      )}
    </div>
  );
} 