'use client';

import { useEffect, useState } from 'react';

interface WeatherWidgetProps {
  location: string;
  date: Date | null;
}

interface WeatherData {
  temperature: number;
  description: string;
  conditionCode: string;
  additionalInfo?: {
    windSpeed: number;
    windDirection: number;
    humidity: number;
    pressure: number;
    precipitation: number;
    cloudCover: number;
    feelsLike: number;
  };
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

// Weather icons mapping
const getWeatherIcon = (conditionCode: string): string => {
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

export default function WeatherWidget({ location, date }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/weather?location=${location}&date=${date.toISOString().split('T')[0]}`);
        if (!response.ok) throw new Error('Nepavyko gauti orų prognozės');
        const data = await response.json();
        
        // Extract weather data from the response
        if (data.forecastTimestamps && data.forecastTimestamps.length > 0) {
          const forecast = data.forecastTimestamps[0];
          setWeather({
            temperature: forecast.airTemperature,
            description: forecast.conditionCode,
            conditionCode: forecast.conditionCode,
            additionalInfo: data.additionalInfo || {
              windSpeed: forecast.windSpeed,
              windDirection: forecast.windDirection,
              humidity: forecast.relativeHumidity,
              pressure: forecast.seaLevelPressure,
              precipitation: forecast.totalPrecipitation,
              cloudCover: forecast.cloudCover,
              feelsLike: forecast.feelsLikeTemperature
            }
          });
        } else {
          throw new Error('Nėra orų duomenų');
        }
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
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-lg font-semibold">{weather.temperature}°C</p>
          <p className="text-gray-600">{weatherDescriptions[weather.conditionCode] || weather.description}</p>
          {weather.additionalInfo && (
            <p className="text-sm text-gray-500">Jausmas: {weather.additionalInfo.feelsLike}°C</p>
          )}
        </div>
        {weather.conditionCode && (
          <div className="text-3xl">
            {getWeatherIcon(weather.conditionCode)}
          </div>
        )}
      </div>
      
      {weather.additionalInfo && (
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>💨 Vėjas: {weather.additionalInfo.windSpeed} m/s</div>
          <div>💧 Drėgmė: {weather.additionalInfo.humidity}%</div>
          <div>☔ Krituliai: {weather.additionalInfo.precipitation} mm</div>
          <div>☁️ Debesys: {weather.additionalInfo.cloudCover}%</div>
        </div>
      )}
    </div>
  );
} 