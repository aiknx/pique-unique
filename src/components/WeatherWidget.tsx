'use client';

import { useEffect, useState } from 'react';
import { getWeatherData, getUVDescription, getWaveDescription, isGoodWeatherForPicnic } from '@/services/weather';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  humidity: number;
  pressure: number;
  cloudiness: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  waveHeight?: number;
  waterTemperature?: number;
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
    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);
        const data = await getWeatherData(location, date || undefined);
        setWeather(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Įvyko klaida');
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [location, date]);

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-6">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const isGoodWeather = isGoodWeatherForPicnic(weather);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Pagrindinė informacija */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-baseline">
            <p className="text-4xl font-bold">{weather.temperature}°C</p>
            <p className="text-gray-500 ml-2">Jaučiasi kaip {weather.feelsLike}°C</p>
          </div>
          <p className="text-lg text-gray-600">{weather.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Saulėtekis: {weather.sunrise}
          </p>
          <p className="text-sm text-gray-600">
            Saulėlydis: {weather.sunset}
          </p>
        </div>
      </div>

      {/* Detalesnė informacija */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-500">Vėjas</p>
          <p className="font-medium">{weather.windSpeed} m/s {weather.windDirection}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-500">Krituliai</p>
          <p className="font-medium">{weather.precipitation}%</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-500">Debesuotumas</p>
          <p className="font-medium">{weather.cloudiness}%</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-500">UV Indeksas</p>
          <p className="font-medium">{getUVDescription(weather.uvIndex)}</p>
        </div>
      </div>

      {/* Papildoma informacija pajūriui */}
      {weather.waveHeight && weather.waterTemperature && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">Bangos</p>
            <p className="font-medium">{getWaveDescription(weather.waveHeight)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-500">Vandens temperatūra</p>
            <p className="font-medium">{weather.waterTemperature}°C</p>
          </div>
        </div>
      )}

      {/* Rekomendacija */}
      <div className={`mt-4 p-3 rounded-lg text-center ${
        isGoodWeather ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
      }`}>
        {isGoodWeather
          ? 'Puikus oras piknikui! 🌞'
          : 'Orai nėra idealūs piknikui. Rekomenduojame pasirinkti kitą dieną. 🌥'}
      </div>

      {date && (
        <p className="text-sm text-gray-500 text-center mt-4">
          * Orų prognozė gali keistis. Tikslesnę informaciją matysite likus 3 dienoms iki pikniko.
        </p>
      )}
    </div>
  );
} 