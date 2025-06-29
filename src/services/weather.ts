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
  waveHeight?: number; // Tik pajūrio vietovėms
  waterTemperature?: number; // Tik pajūrio vietovėms
}

interface LocationCoordinates {
  lat: number;
  lon: number;
}

const LOCATIONS: Record<string, LocationCoordinates> = {
  klaipeda: { lat: 55.7033, lon: 21.1443 },
  juodkrante: { lat: 55.5533, lon: 21.1222 },
  nida: { lat: 55.3033, lon: 21.0094 },
};

export async function getWeatherData(location: string, date?: Date): Promise<WeatherData> {
  try {
    const coordinates = LOCATIONS[location];
    if (!coordinates) {
      throw new Error('Nežinoma vietovė');
    }

    // Use our Next.js API route instead of calling MeteoLT directly
    const response = await fetch('/api/weather');
    if (!response.ok) {
      throw new Error('Nepavyko gauti orų duomenų');
    }

    const data = await response.json();
    
    // Process the MeteoLT API response
    const forecast = data.forecastTimestamps[0]; // Get the latest forecast
    
    return {
      temperature: forecast.airTemperature,
      feelsLike: forecast.feelsLikeTemperature,
      description: getWeatherDescription(forecast.conditionCode),
      windSpeed: forecast.windSpeed,
      windDirection: getWindDirection(forecast.windDirection),
      precipitation: forecast.totalPrecipitation,
      humidity: forecast.relativeHumidity,
      pressure: forecast.seaLevelPressure,
      cloudiness: forecast.cloudCover,
      uvIndex: 5, // MeteoLT doesn't provide UV index
      sunrise: '05:30', // MeteoLT doesn't provide sunrise/sunset times
      sunset: '21:30', // MeteoLT doesn't provide sunrise/sunset times
      // Optional coastal data - we'll leave these undefined if not available
      waveHeight: location === 'klaipeda' ? 0.5 : undefined,
      waterTemperature: location === 'klaipeda' ? 18 : undefined,
    };
  } catch (error) {
    console.error('Klaida gaunant orų duomenis:', error);
    throw error;
  }
}

function getWeatherDescription(conditionCode: string): string {
  const descriptions: Record<string, string> = {
    'clear': 'Giedra',
    'partly-cloudy': 'Mažai debesuota',
    'cloudy-with-sunny-intervals': 'Debesuota su pragiedruliais',
    'cloudy': 'Debesuota',
    'thunder': 'Perkūnija',
    'isolated-thunderstorms': 'Vietomis perkūnija',
    'thunderstorms': 'Perkūnija',
    'heavy-rain': 'Stiprus lietus',
    'light-rain': 'Nedidelis lietus',
    'rain': 'Lietus',
    'sleet': 'Šlapdriba',
    'light-snow': 'Nedidelis sniegas',
    'snow': 'Sniegas',
    'heavy-snow': 'Stiprus sniegas',
    'fog': 'Rūkas',
    'na': 'Nežinoma',
  };
  
  return descriptions[conditionCode] || 'Nežinoma';
}

export function getWindDirection(degrees: number): string {
  const directions = ['Š', 'ŠR', 'R', 'PR', 'P', 'PV', 'V', 'ŠV'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function getUVDescription(index: number): string {
  if (index <= 2) return 'Žemas';
  if (index <= 5) return 'Vidutinis';
  if (index <= 7) return 'Aukštas';
  if (index <= 10) return 'Labai aukštas';
  return 'Ekstremalus';
}

export function getWaveDescription(height: number): string {
  if (height <= 0.2) return 'Ramu';
  if (height <= 0.5) return 'Švelnu';
  if (height <= 1.0) return 'Vidutinės bangos';
  if (height <= 1.5) return 'Banguota';
  return 'Didelės bangos';
}

export function isGoodWeatherForPicnic(weather: WeatherData): boolean {
  return (
    weather.temperature >= 18 &&
    weather.temperature <= 28 &&
    weather.precipitation < 20 &&
    weather.windSpeed < 8 &&
    weather.cloudiness < 70
  );
} 