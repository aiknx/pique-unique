'use client';

import { useEffect, useState, useRef } from 'react';

interface WeatherWidgetProps {
  location: string;
  date?: string;
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

const weatherDescriptions: Record<string, string> = {
  'clear': 'Giedra',
  'partly-cloudy': 'Drumstai',
  'cloudy': 'Debesuota',
  'overcast': 'Debesuota',
  'light-rain': 'Šviesus lietus',
  'rain': 'Lietus',
  'heavy-rain': 'Stiprus lietus',
  'sleet': 'Šlapdriba',
  'light-snow': 'Šviesus sniegas',
  'snow': 'Sniegas',
  'heavy-snow': 'Stiprus sniegas',
  'fog': 'Rūkas',
  'na': 'Nėra duomenų'
};

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

// Client-side cache to prevent unnecessary API calls
const clientWeatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CLIENT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function WeatherWidget({ location, date }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<string>('');

  useEffect(() => {
    if (!location) {
      setWeather(null);
      setError(null);
      return;
    }

    // Use provided date or today's date
    const dateStr = date || new Date().toISOString().split('T')[0];
    const cacheKey = `${location}-${dateStr}`;
    
    // Check if we already have recent data in client cache
    const cached = clientWeatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CLIENT_CACHE_DURATION) {
      setWeather(cached.data);
      return;
    }

    // Check if this is the same request as the last one
    if (lastRequestRef.current === cacheKey) {
      return;
    }

    // Clear previous timeout and abort previous request
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      lastRequestRef.current = cacheKey;
      
      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();
      
      try {
        const response = await fetch(
          `/api/weather?location=${location}&date=${dateStr}`,
          { signal: abortControllerRef.current.signal }
        );
        
        if (!response.ok) throw new Error('Nepavyko gauti orų prognozės');
        const data = await response.json();
        
        // Extract weather data from the response
        if (data.forecastTimestamps && data.forecastTimestamps.length > 0) {
          const forecast = data.forecastTimestamps[0];
          const weatherData = {
            temperature: forecast.airTemperature,
            description: weatherDescriptions[forecast.conditionCode] || forecast.conditionCode,
            conditionCode: forecast.conditionCode,
            additionalInfo: {
              windSpeed: forecast.windSpeed,
              windDirection: forecast.windDirection,
              humidity: forecast.relativeHumidity,
              pressure: forecast.seaLevelPressure,
              precipitation: forecast.totalPrecipitation,
              cloudCover: forecast.cloudCover,
              feelsLike: forecast.feelsLikeTemperature
            }
          };
          
          // Cache the data client-side
          clientWeatherCache.set(cacheKey, {
            data: weatherData,
            timestamp: Date.now()
          });
          
          setWeather(weatherData);
        } else {
          throw new Error('Nėra orų duomenų');
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was aborted, don't set error
          return;
        }
        setError('Nepavyko gauti orų prognozės');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Reduced debouncing to 500ms for faster response
    timeoutRef.current = setTimeout(fetchWeather, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [location, date]);

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
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500">Kraunama orų prognozė...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl">{getWeatherIcon(weather.conditionCode)}</div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{Math.round(weather.temperature)}°C</div>
          <div className="text-sm text-gray-600">{weatherDescriptions[weather.conditionCode] || weather.conditionCode}</div>
        </div>
      </div>

      {weather.additionalInfo && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Jausmas:</span>
            <span className="font-medium">{Math.round(weather.additionalInfo.feelsLike)}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Vėjas:</span>
            <span className="font-medium">{weather.additionalInfo.windSpeed} m/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Drėgmė:</span>
            <span className="font-medium">{weather.additionalInfo.humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Slėgis:</span>
            <span className="font-medium">{weather.additionalInfo.pressure} hPa</span>
          </div>
          {weather.additionalInfo.precipitation > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Krituliai:</span>
              <span className="font-medium">{weather.additionalInfo.precipitation} mm</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Debesuotumas:</span>
            <span className="font-medium">{weather.additionalInfo.cloudCover}%</span>
          </div>
        </div>
      )}
    </div>
  );
} 