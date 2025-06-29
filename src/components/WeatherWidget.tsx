'use client';

import { useEffect, useState } from 'react';

interface WeatherData {
  temperature: number;
  description: string;
  windSpeed: number;
  precipitation: number;
}

interface WeatherWidgetProps {
  location: string;
  date: Date | null;
}

export default function WeatherWidget({ location, date }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Implement actual weather API call
    // For now, using mock data
    const mockWeather = {
      temperature: 22,
      description: 'Saulėta',
      windSpeed: 5,
      precipitation: 0,
    };

    // Simulate API call
    setTimeout(() => {
      setWeather(mockWeather);
      setLoading(false);
    }, 1000);
  }, [location, date]);

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg p-4">
        <p className="text-center text-gray-600">Kraunami orai...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 rounded-lg p-4">
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-3xl font-bold">{weather.temperature}°C</p>
          <p className="text-gray-600">{weather.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Vėjas: {weather.windSpeed} m/s
          </p>
          <p className="text-sm text-gray-600">
            Krituliai: {weather.precipitation}%
          </p>
        </div>
      </div>
      
      {date && (
        <p className="text-sm text-gray-500 text-center">
          * Orų prognozė gali keistis. Tikslesnę informaciją matysite likus 3 dienoms iki pikniko.
        </p>
      )}
    </div>
  );
} 