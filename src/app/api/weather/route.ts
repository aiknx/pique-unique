import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const LOCATIONS = {
  klaipeda: 'klaipeda',
  juodkrante: 'juodkrante',
  nida: 'nida',
  vilnius: 'vilnius',
};

interface ForecastTimestamp {
  forecastTimeUtc: string;
  airTemperature: number;
  conditionCode: string;
  windSpeed?: number;
  windDirection?: number;
  relativeHumidity?: number;
  seaLevelPressure?: number;
  totalPrecipitation?: number;
  cloudCover?: number;
  feelsLikeTemperature?: number;
  [key: string]: unknown;
}

interface WeatherData {
  place: {
    code: string;
    name: string;
    [key: string]: unknown;
  };
  forecastTimestamps: ForecastTimestamp[];
  [key: string]: unknown;
}

interface WeatherCacheData {
  data: WeatherData;
  timestamp: number;
}

// Simple in-memory cache
const weatherCache = new Map<string, WeatherCacheData>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function getCachedWeather(location: string): WeatherData | null {
  const cached = weatherCache.get(location);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedWeather(location: string, data: WeatherData): void {
  weatherCache.set(location, {
    data,
    timestamp: Date.now()
  });
}

export async function GET(request: NextRequest) {
  try {
    const location = request.nextUrl.searchParams.get('location')?.toLowerCase() || 'klaipeda';
    const date = request.nextUrl.searchParams.get('date');

    if (!LOCATIONS[location as keyof typeof LOCATIONS]) {
      return NextResponse.json(
        { error: 'Invalid location' },
        { status: 400 }
      );
    }

    // Check cache first
    const cachedData = getCachedWeather(location);
    if (cachedData) {
      console.log(`Using cached weather data for ${location}`);
      
      // Filter for specific date if requested
      if (date && cachedData.forecastTimestamps) {
        const targetDate = new Date(date);
        targetDate.setHours(12, 0, 0, 0);
        
        const filteredForecasts = cachedData.forecastTimestamps.filter((forecast) => {
          const forecastDate = new Date(forecast.forecastTimeUtc);
          forecastDate.setHours(12, 0, 0, 0);
          return forecastDate.getTime() === targetDate.getTime();
        });
        
        if (filteredForecasts.length > 0) {
          cachedData.forecastTimestamps = filteredForecasts;
        } else {
          const dayStart = new Date(targetDate);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(targetDate);
          dayEnd.setHours(23, 59, 59, 999);
          
          const dayForecasts = cachedData.forecastTimestamps.filter((forecast) => {
            const forecastDate = new Date(forecast.forecastTimeUtc);
            return forecastDate >= dayStart && forecastDate <= dayEnd;
          });
          
          if (dayForecasts.length > 0) {
            cachedData.forecastTimestamps = [dayForecasts[0]];
          }
        }
      }
      
      return NextResponse.json(cachedData);
    }

    // Use real MeteoLT API with longer cache
    const apiUrl = `https://api.meteo.lt/v1/places/${location}/forecasts/long-term`;
    
    const headersList = headers();
    const host = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const origin = `${protocol}://${host}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Pique Unique Weather Widget',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`MeteoLT API error: ${response.status} ${response.statusText}`);
      
      // If rate limited, return cached data if available
      if (response.status === 429) {
        const oldCached = weatherCache.get(location);
        if (oldCached) {
          console.log(`Rate limited, using old cached data for ${location}`);
          return NextResponse.json(oldCached.data);
        }
      }
      
      throw new Error(`MeteoLT API responded with status: ${response.status}`);
    }

    const data: WeatherData = await response.json();
    
    // Cache the data
    setCachedWeather(location, data);
    
    // Filter forecast for the requested date if provided
    if (date && data.forecastTimestamps) {
      const targetDate = new Date(date);
      targetDate.setHours(12, 0, 0, 0);
      
      const filteredForecasts = data.forecastTimestamps.filter((forecast) => {
        const forecastDate = new Date(forecast.forecastTimeUtc);
        forecastDate.setHours(12, 0, 0, 0);
        return forecastDate.getTime() === targetDate.getTime();
      });
      
      if (filteredForecasts.length > 0) {
        data.forecastTimestamps = filteredForecasts;
      } else {
        const dayStart = new Date(targetDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(targetDate);
        dayEnd.setHours(23, 59, 59, 999);
        
        const dayForecasts = data.forecastTimestamps.filter((forecast) => {
          const forecastDate = new Date(forecast.forecastTimeUtc);
          return forecastDate >= dayStart && forecastDate <= dayEnd;
        });
        
        if (dayForecasts.length > 0) {
          data.forecastTimestamps = [dayForecasts[0]];
        }
      }
    }
    
    // Set CORS headers
    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', origin);
    responseHeaders.set('Access-Control-Allow-Methods', 'GET');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    responseHeaders.set('Access-Control-Max-Age', '86400');
    
    // Extract additional weather information
    const enhancedData = {
      ...data,
      additionalInfo: data.forecastTimestamps?.[0] ? {
        windSpeed: data.forecastTimestamps[0].windSpeed,
        windDirection: data.forecastTimestamps[0].windDirection,
        humidity: data.forecastTimestamps[0].relativeHumidity,
        pressure: data.forecastTimestamps[0].seaLevelPressure,
        precipitation: data.forecastTimestamps[0].totalPrecipitation,
        cloudCover: data.forecastTimestamps[0].cloudCover,
        feelsLike: data.forecastTimestamps[0].feelsLikeTemperature
      } : null
    };
    
    return NextResponse.json(enhancedData, {
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch weather data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
