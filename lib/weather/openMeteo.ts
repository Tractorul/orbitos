import {
  WeatherData,
  CurrentWeather,
  DailyForecast,
  WeatherLocation,
} from "@/types/weather";
import { getWMOInfo } from "./wmoCodes";

const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const REQUEST_TIMEOUT_MS = 8000;

export async function fetchOpenMeteoForecast(
  location: WeatherLocation,
  signal?: AbortSignal
): Promise<WeatherData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  // Link caller signal if provided
  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  try {
    const params = new URLSearchParams({
      latitude: location.latitude.toFixed(4),
      longitude: location.longitude.toFixed(4),
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "is_day",
        "precipitation",
        "weather_code",
        "wind_speed_10m",
      ].join(","),
      hourly: "precipitation_probability",
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_probability_max",
      ].join(","),
      timezone: "auto",
      forecast_days: "4",
    });

    const response = await fetch(`${OPEN_METEO_FORECAST_URL}?${params.toString()}`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate essential response structure
    if (!data || !data.current || typeof data.current.temperature_2m !== "number") {
      throw new Error("Date meteo primite invalide sau incomplete de la Open-Meteo");
    }

    const currentRaw = data.current;
    const isDay = currentRaw.is_day === 1;
    const weatherCode = currentRaw.weather_code ?? 0;
    const wmoInfo = getWMOInfo(weatherCode, isDay);

    // Get current precipitation probability from hourly if available
    let currentPrecipProb = 0;
    if (data.hourly && Array.isArray(data.hourly.precipitation_probability)) {
      const currentHourIndex = new Date().getHours();
      currentPrecipProb = data.hourly.precipitation_probability[currentHourIndex] ?? 0;
    } else if (data.daily && data.daily.precipitation_probability_max?.[0]) {
      currentPrecipProb = data.daily.precipitation_probability_max[0];
    }

    const current: CurrentWeather = {
      temperature: Math.round(currentRaw.temperature_2m),
      apparentTemperature: Math.round(currentRaw.apparent_temperature ?? currentRaw.temperature_2m),
      weatherCode,
      weatherDescription: wmoInfo.description,
      precipitationProbability: Math.round(currentPrecipProb),
      windSpeed: Math.round(currentRaw.wind_speed_10m ?? 0),
      isDay,
      time: currentRaw.time,
    };

    // Parse 4-day daily forecast
    const daily: DailyForecast[] = [];
    if (data.daily && Array.isArray(data.daily.time)) {
      const dayNames = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
      const fullDayNames = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];

      for (let i = 0; i < data.daily.time.length; i++) {
        const dateStr = data.daily.time[i];
        const forecastDate = new Date(dateStr);
        const dayName = i === 0 ? "Astăzi" : i === 1 ? "Mâine" : fullDayNames[forecastDate.getDay()] || dayNames[forecastDate.getDay()];

        const dailyCode = data.daily.weather_code?.[i] ?? 0;
        const dailyWmo = getWMOInfo(dailyCode, true);

        daily.push({
          date: dateStr,
          dayName,
          weatherCode: dailyCode,
          weatherDescription: dailyWmo.description,
          tempMax: Math.round(data.daily.temperature_2m_max?.[i] ?? current.temperature),
          tempMin: Math.round(data.daily.temperature_2m_min?.[i] ?? current.temperature),
          precipitationProbabilityMax: Math.round(
            data.daily.precipitation_probability_max?.[i] ?? 0
          ),
        });
      }
    }

    return {
      current,
      daily,
      location,
      fetchedAt: Date.now(),
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Cererea meteo a expirat (timeout).");
    }
    throw err;
  }
}

export async function searchOpenMeteoLocations(
  query: string,
  signal?: AbortSignal
): Promise<WeatherLocation[]> {
  if (!query || query.trim().length < 2) return [];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  try {
    const params = new URLSearchParams({
      name: query.trim(),
      count: "6",
      language: "ro",
      format: "json",
    });

    const res = await fetch(`${OPEN_METEO_GEOCODING_URL}?${params.toString()}`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: { name: string; country?: string; admin1?: string; latitude: number; longitude: number }) => ({
      name: item.name,
      country: item.country || "România",
      admin1: item.admin1,
      latitude: item.latitude,
      longitude: item.longitude,
      source: "manual" as const,
    }));
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn("[Weather] Eroare căutare locație Open-Meteo:", err);
    return [];
  }
}
