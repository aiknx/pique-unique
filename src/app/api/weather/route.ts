import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// MeteoLT API locations mapping
// Note: All locations use their actual MeteoLT API codes
const LOCATIONS = {
  klaipeda: 'klaipeda',
  juodkrante: 'neringa-juodkrante', // Actual MeteoLT code for Juodkrantė
  nida: 'neringa-nida',              // Actual MeteoLT code for Nida
  palanga: 'palanga',                // Actual MeteoLT code for Palanga
  svencele: 'klaipeda'               // Use Klaipėda data for Švenčelė (close by)
} as const;

interface WeatherData {
  place: {
    code: string;
    name: string;
  };
  forecastTimestamps: Array<{
    forecastTimeUtc: string;
    airTemperature: number;
    conditionCode: string;
    windSpeed: number;
    windDirection: number;
    relativeHumidity: number;
    seaLevelPressure: number;
    totalPrecipitation: number;
    cloudCover: number;
    feelsLikeTemperature: number;
  }>;
  _rateLimited?: boolean;
  _fallback?: boolean;
}

interface WeatherCacheData {
  data: WeatherData;
  timestamp: number;
}

// Enhanced in-memory cache with rate limiting protection and request deduplication
const weatherCache = new Map<string, WeatherCacheData>();
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours (increased from 1 hour)
const RATE_LIMIT_CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours for rate limited responses
const pendingRequests = new Map<string, Promise<WeatherData>>();

function getCachedWeather(location: string): WeatherData | null {
  const cached = weatherCache.get(location);
  if (cached) {
    const age = Date.now() - cached.timestamp;
    // Use longer cache duration for rate limited responses
    const maxAge = cached.data._rateLimited ? RATE_LIMIT_CACHE_DURATION : CACHE_DURATION;
    if (age < maxAge) {
      return cached.data;
    }
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
    const locationParam = request.nextUrl.searchParams.get('location')?.toLowerCase() || 'klaipeda';
    const date = request.nextUrl.searchParams.get('date');

    if (!LOCATIONS[locationParam as keyof typeof LOCATIONS]) {
      return NextResponse.json(
        { error: 'Invalid location' },
        { status: 400 }
      );
    }

    // Get the actual MeteoLT API location code
    const location = LOCATIONS[locationParam as keyof typeof LOCATIONS];

    // Check cache first
    const cachedData = getCachedWeather(location);
    if (cachedData) {
      console.log(`Using cached weather data for ${locationParam} (${location})`);
      
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

    // Check if there's already a pending request for this location
    const pendingRequest = pendingRequests.get(location);
    if (pendingRequest) {
      console.log(`Waiting for pending request for ${locationParam} (${location})`);
      const data = await pendingRequest;
      
      // Filter for specific date if requested
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
      
      return NextResponse.json(data);
    }

    // Create new request promise
    const requestPromise = (async () => {
      // Use real MeteoLT API with longer cache
      const apiUrl = `https://api.meteo.lt/v1/places/${location}/forecasts/long-term`;
      
      console.log(`Fetching weather data for ${locationParam} (${location}) from: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Pique Unique Weather Widget',
        },
        next: { revalidate: 7200 } // Cache for 2 hours
      });

      if (!response.ok) {
        console.error(`MeteoLT API error: ${response.status} ${response.statusText}`);
        
        // If rate limited, return cached data if available
        if (response.status === 429) {
          const oldCached = weatherCache.get(location);
          if (oldCached) {
            console.log(`Rate limited, using old cached data for ${locationParam} (${location})`);
            // Mark the cached data as rate limited for longer cache duration
            oldCached.data._rateLimited = true;
            return oldCached.data;
          }
          
          // If no cached data available, return a fallback response
          console.log(`Rate limited and no cached data for ${locationParam} (${location}), returning fallback`);
          const fallbackData = {
            place: { code: location, name: locationParam },
            forecastTimestamps: [{
              forecastTimeUtc: new Date().toISOString(),
              airTemperature: 15,
              conditionCode: 'clear',
              windSpeed: 5,
              windDirection: 180,
              relativeHumidity: 60,
              seaLevelPressure: 1013,
              totalPrecipitation: 0,
              cloudCover: 20,
              feelsLikeTemperature: 14
            }],
            _rateLimited: true,
            _fallback: true
          };
          
          // Cache the fallback data
          setCachedWeather(location, fallbackData);
          return fallbackData;
        }
        
        throw new Error(`MeteoLT API responded with status: ${response.status}`);
      }

      const data: WeatherData = await response.json();
      
      // Cache the data
      setCachedWeather(location, data);
      
      return data;
    })();

    // Store the pending request
    pendingRequests.set(location, requestPromise);

    try {
      const data = await requestPromise;
      
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
      const headersList = headers();
      const host = headersList.get('host') || '';
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const origin = `${protocol}://${host}`;
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
    } finally {
      // Clean up pending request
      pendingRequests.delete(location);
    }
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
