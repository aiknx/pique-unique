import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const LOCATIONS = {
  klaipeda: 'klaipeda',
  juodkrante: 'juodkrante',
  nida: 'nida',
  vilnius: 'vilnius', // fallback
};

export async function GET(request: NextRequest) {
  try {
    // Get location from query parameters, default to klaipeda
    const location = request.nextUrl.searchParams.get('location')?.toLowerCase() || 'klaipeda';

    // Validate location
    if (!LOCATIONS[location as keyof typeof LOCATIONS]) {
      return NextResponse.json(
        { error: 'Invalid location' },
        { status: 400 }
      );
    }

    const apiUrl = `https://api.meteo.lt/v1/places/${location}/forecasts/long-term`;
    
    // Get the request headers
    const headersList = headers();
    const host = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const origin = `${protocol}://${host}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Origin': origin,
        'User-Agent': 'Pique Unique Weather Widget',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 1800 } // Cache for 30 minutes
    });

    if (!response.ok) {
      throw new Error(`MeteoLT API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter forecast for the requested date if provided
    const dateParam = request.nextUrl.searchParams.get('date');
    if (dateParam && data.forecastTimestamps) {
      const targetDate = new Date(dateParam);
      targetDate.setHours(12, 0, 0, 0); // Set to noon for better matching
      
      const filteredForecasts = data.forecastTimestamps.filter((forecast: { forecastTimeUtc: string }) => {
        const forecastDate = new Date(forecast.forecastTimeUtc);
        forecastDate.setHours(12, 0, 0, 0);
        return forecastDate.getTime() === targetDate.getTime();
      });
      
      if (filteredForecasts.length > 0) {
        data.forecastTimestamps = filteredForecasts;
      } else {
        // If no exact match, get the first forecast for that day
        const dayStart = new Date(targetDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(targetDate);
        dayEnd.setHours(23, 59, 59, 999);
        
        const dayForecasts = data.forecastTimestamps.filter((forecast: { forecastTimeUtc: string }) => {
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
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
