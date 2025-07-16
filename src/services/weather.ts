import { addDays, format } from 'date-fns';

// Meteo.lt API response types
interface MeteoLTForecast {
  place: {
    code: string;
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  forecastTimestamps: MeteoLTTimestamp[];
}

interface MeteoLTTimestamp {
  forecastTimeUtc: string;
  airTemperature: number;
  feelsLikeTemperature: number;
  windSpeed: number;
  windGust: number;
  windDirection: number;
  cloudCover: number;
  seaLevelPressure: number;
  relativeHumidity: number;
  totalPrecipitation: number;
  conditionCode: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  cloudiness: number;
  precipitation: number;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  pressure: number;
  conditionCode: string;
}

// Convert wind direction degrees to cardinal directions
function degreesToCardinal(degrees: number): string {
  const directions = ['Š', 'ŠR', 'R', 'PR', 'P', 'PV', 'V', 'ŠV'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export async function getWeatherData(location: string, date?: Date): Promise<WeatherData> {
  try {
    // Jei data nenurodyta, naudojame dabartinę datą
    const targetDate = date || new Date();
    
    // Tikriname ar data yra ne vėliau nei 7 dienos į priekį
    const maxDate = addDays(new Date(), 7);
    if (targetDate > maxDate) {
      throw new Error('Galima gauti orų prognozę tik 7 dienoms į priekį');
    }

    const formattedDate = format(targetDate, 'yyyy-MM-dd');
    const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}&date=${formattedDate}`);
    
    if (!response.ok) {
      throw new Error('Nepavyko gauti orų prognozės');
    }

    const data: MeteoLTForecast = await response.json();
    const forecast = data.forecastTimestamps[0];
    
    // Konvertuojame meteo.lt duomenis į mūsų formatą
    return {
      temperature: forecast.airTemperature,
      feelsLike: forecast.feelsLikeTemperature,
      description: forecast.conditionCode,
      cloudiness: forecast.cloudCover,
      precipitation: forecast.totalPrecipitation,
      windSpeed: forecast.windSpeed,
      windDirection: degreesToCardinal(forecast.windDirection),
      humidity: forecast.relativeHumidity,
      pressure: forecast.seaLevelPressure,
      conditionCode: forecast.conditionCode
    };
  } catch (error) {
    console.error('Klaida gaunant orų prognozę:', error);
    throw error;
  }
}

export function isGoodWeatherForPicnic(weather: WeatherData): boolean {
  return (
    weather.temperature >= 15 &&
    weather.precipitation < 0.5 &&
    weather.windSpeed < 5 &&
    weather.cloudiness < 70
  );
}

export function getUVDescription(uvIndex: number): string {
  if (uvIndex <= 2) return 'Žemas';
  if (uvIndex <= 5) return 'Vidutinis';
  if (uvIndex <= 7) return 'Aukštas';
  if (uvIndex <= 10) return 'Labai aukštas';
  return 'Ekstremalus';
}

export function getWaveDescription(waveHeight: number): string {
  if (waveHeight <= 0.5) return 'Ramu';
  if (waveHeight <= 1.0) return 'Lengvos bangos';
  if (waveHeight <= 1.5) return 'Vidutinės bangos';
  if (waveHeight <= 2.0) return 'Didelės bangos';
  return 'Labai didelės bangos';
} 