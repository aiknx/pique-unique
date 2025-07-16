'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface WeatherWidgetProps {
  location: string;
  date: Date | null;
}

interface WeatherData {
  temperature: number;
  description: string;
  conditionCode: string;
}

// Meteo.lt condition codes to human readable text mapping
const weatherDescriptions: Record<string, string> = {
  'clear': 'Giedra',
  'partly-cloudy': 'Mažai debesuota',
  'cloudy': 'Debesuota',
  'overcast': 'Apsiniaukę',
  'light-rain': 'Nedidelis lietus',
  'rain': 'Lietus',
  'heavy-rain': 'Smarkus lietus',
  'sleet': 'Šlapdriba',
  'light-snow': 'Nedidelis sniegas',
  'snow': 'Sniegas',
  'heavy-snow': 'Smarkus sniegas',
  'fog': 'Rūkas',
  'na': 'Nėra duomenų'
};

export default function WeatherWidget({ location, date }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) return;

    // In development, just show placeholder
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/weather?location=${location}&date=${date.toISOString().split('T')[0]}`);
        if (!response.ok) throw new Error('Nepavyko gauti orų prognozės');
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError('Nepavyko gauti orų prognozės');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, date]);

  if (!date) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500">Pasirinkite datą, kad matytumėte orų prognozę</p>
      </div>
    );
  }

  // Show development placeholder
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500">Orų prognozė prieinama tik produkcijos aplinkoje</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">{weather.temperature}°C</p>
          <p className="text-gray-600">{weatherDescriptions[weather.conditionCode] || weather.description}</p>
        </div>
        {weather.conditionCode && (
          <Image
            src={`https://api.meteo.lt/weather-conditions/${weather.conditionCode}`}
            alt={weatherDescriptions[weather.conditionCode] || weather.description}
            width={50}
            height={50}
            className="w-12 h-12"
          />
        )}
      </div>
    </div>
  );
} 