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
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location')?.toLowerCase() || 'klaipeda';

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
    
    // Set CORS headers
    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', origin);
    responseHeaders.set('Access-Control-Allow-Methods', 'GET');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    responseHeaders.set('Access-Control-Max-Age', '86400');
    
    return NextResponse.json(data, {
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
