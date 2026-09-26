export interface WeatherLocation {
  name: string;
  country?: string;
  admin1?: string; // Region / County (Județ)
  latitude: number;
  longitude: number;
  source: "gps" | "manual" | "default";
}

export interface CurrentWeather {
  temperature: number;          // °C
  apparentTemperature: number;  // °C ("Se simte ca")
  weatherCode: number;          // WMO code (0–99)
  weatherDescription: string;   // Romanian description
  precipitationProbability: number; // %
  windSpeed: number;            // km/h
  isDay: boolean;
  time: string;
}

export interface DailyForecast {
  date: string;                 // YYYY-MM-DD
  dayName: string;              // "Astăzi", "Mâine", "Vineri", etc.
  weatherCode: number;
  weatherDescription: string;
  tempMax: number;              // °C
  tempMin: number;              // °C
  precipitationProbabilityMax: number; // %
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  location: WeatherLocation;
  fetchedAt: number;            // Timestamp in milliseconds
}

export interface WeatherCacheEntry {
  weatherData: WeatherData;
  location: WeatherLocation;
  fetchedAt: number;
  expiresAt: number;
}

export type WeatherState =
  | "loading"
  | "success"
  | "stale"
  | "location-required"
  | "location-denied"
  | "error"
  | "offline";

export type TemperatureUnit = "C" | "F";
