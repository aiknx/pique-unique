'use client';

import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isAfter, isBefore, addDays } from 'date-fns';
import { lt } from 'date-fns/locale';

interface CalendarProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  minDate: Date;
  maxDate: Date;
  location?: string;
}

interface WeatherData {
  temperature: number;
  conditionCode: string;
}

export default function Calendar({ selectedDate, onChange, minDate, maxDate, location = 'klaipeda' }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const isDateSelectable = (date: Date) => {
    return !isBefore(date, minDate) && !isAfter(date, maxDate);
  };

  // Fetch weather and booked dates for current month
  useEffect(() => {
    const fetchMonthData = async () => {
      if (!location) return;

      try {
        // Fetch booked dates
        const startDate = format(monthStart, 'yyyy-MM-dd');
        const endDate = format(monthEnd, 'yyyy-MM-dd');
        
        const bookedResponse = await fetch(`/api/booked-dates?location=${location}&startDate=${startDate}&endDate=${endDate}`);
        if (bookedResponse.ok) {
          const bookedData = await bookedResponse.json();
          setBookedDates(new Set(bookedData.bookedDates || []));
        }

        // Fetch weather for the entire month in one request
        const today = new Date();
        
        // Only fetch weather for next 7 days to avoid rate limiting
        const weatherPromises = [];
        for (let i = 1; i <= 7; i++) {
          const futureDate = addDays(today, i);
          if (futureDate >= monthStart && futureDate <= monthEnd) {
            const dateStr = format(futureDate, 'yyyy-MM-dd');
            weatherPromises.push(
              fetch(`/api/weather?location=${location}&date=${dateStr}`)
                .then(response => response.ok ? response.json() : null)
                .then(data => {
                  if (data?.forecastTimestamps?.[0]) {
                    const forecast = data.forecastTimestamps[0];
                    return {
                      date: dateStr,
                      weather: {
                        temperature: forecast.airTemperature || 0,
                        conditionCode: forecast.conditionCode || 'clear'
                      }
                    };
                  }
                  return null;
                })
                .catch(error => {
                  console.error('Error fetching weather for date:', futureDate, error);
                  return null;
                })
            );
          }
        }

        const weatherResults = await Promise.all(weatherPromises);
        const weatherMap: Record<string, WeatherData> = {};
        weatherResults.forEach(result => {
          if (result) {
            weatherMap[result.date] = result.weather;
          }
        });
        setWeatherData(weatherMap);
      } catch (error) {
        console.error('Error fetching month data:', error);
      }
    };

    fetchMonthData();
  }, [currentMonth, location, monthStart, monthEnd]);

  const getWeatherIcon = (conditionCode: string) => {
    const icons: Record<string, string> = {
      'clear': '☀️',
      'partly-cloudy': '⛅',
      'cloudy': '☁️',
      'overcast': '☁️',
      'light-rain': '🌦️',
      'rain': '🌧️',
      'heavy-rain': '⛈️',
      'sleet': '🌨️',
      'light-snow': '🌨️',
      'snow': '❄️',
      'heavy-snow': '❄️',
      'fog': '🌫️',
      'na': '❓'
    };
    return icons[conditionCode] || '❓';
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: lt })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
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
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const dateStr = format(day, 'yyyy-MM-dd');
          const weather = weatherData[dateStr];
          const isBooked = bookedDates.has(dateStr);
          const isToday = isSameDay(day, new Date());
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => isSelectable && !isBooked && onChange(day)}
              disabled={!isSelectable || isBooked}
              className={`
                aspect-square p-2 text-sm rounded-lg transition-colors relative
                ${isBooked
                  ? 'bg-red-100 text-red-600 cursor-not-allowed border border-red-300'
                  : isSelectable 
                    ? isSelected
                      ? 'bg-green-700 text-white'
                      : isToday
                        ? 'bg-blue-100 text-blue-900 hover:bg-green-700 hover:text-white border border-blue-300'
                        : 'bg-white text-gray-900 hover:bg-green-700 hover:text-white border border-gray-200'
                    : 'cursor-not-allowed opacity-50'
                }
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="font-medium">{format(day, 'd')}</span>
                
                {/* Weather icon */}
                {weather && (
                  <div className="text-sm mt-1">
                    <span title={`${weather.temperature}°C`}>
                      {getWeatherIcon(weather.conditionCode)}
                    </span>
                  </div>
                )}
                
                {/* Booked indicator */}
                {isBooked && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
                
                {/* Today indicator */}
                {isToday && !isBooked && !isSelected && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-2 text-xs text-gray-600">
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Šiandien</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-100 border border-red-300 rounded"></div>
            <span>Užimta</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-700 rounded"></div>
            <span>Pasirinkta</span>
          </div>
        </div>
      </div>
    </div>
  );
} 