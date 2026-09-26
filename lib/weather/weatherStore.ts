import { openDB, IDBPDatabase } from "idb";
import { WeatherCacheEntry, WeatherData, WeatherLocation, TemperatureUnit } from "@/types/weather";

const DB_NAME = "orbit_weather_db";
const DB_VERSION = 1;
const WEATHER_STORE = "weather_cache";
const PREFS_STORE = "weather_prefs";

export const WEATHER_CACHE_TTL = 30 * 60 * 1000; // 30 minutes in ms

export const DEFAULT_LOCATION: WeatherLocation = {
  name: "București",
  country: "România",
  admin1: "București",
  latitude: 44.4323,
  longitude: 26.1063,
  source: "default",
};

const LOCAL_STORAGE_CACHE_KEY = "orbit_weather_cache_v1";
const LOCAL_STORAGE_LOCATION_KEY = "orbit_weather_location_v1";
const LOCAL_STORAGE_TEMP_UNIT_KEY = "orbit_temp_unit_v1";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> | null {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return null;
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(WEATHER_STORE)) {
          db.createObjectStore(WEATHER_STORE);
        }
        if (!db.objectStoreNames.contains(PREFS_STORE)) {
          db.createObjectStore(PREFS_STORE);
        }
      },
    }).catch((err) => {
      console.warn("[WeatherStore] IndexedDB open error, falling back to localStorage:", err);
      return null as unknown as IDBPDatabase;
    });
  }
  return dbPromise;
}

// ----------------------------------------------------
// Weather Cache Functions
// ----------------------------------------------------

export async function getCachedWeather(): Promise<WeatherCacheEntry | null> {
  if (typeof window === "undefined") return null;

  // Try IndexedDB first
  try {
    const db = await getDB();
    if (db) {
      const entry = (await db.get(WEATHER_STORE, "latest")) as WeatherCacheEntry | undefined;
      if (entry && entry.weatherData) {
        return entry;
      }
    }
  } catch (err) {
    console.warn("[WeatherStore] Failed to read from IndexedDB:", err);
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
    if (raw) {
      return JSON.parse(raw) as WeatherCacheEntry;
    }
  } catch (err) {
    console.warn("[WeatherStore] Failed to read from localStorage:", err);
  }

  return null;
}

export async function setCachedWeather(
  weatherData: WeatherData,
  location: WeatherLocation
): Promise<void> {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const entry: WeatherCacheEntry = {
    weatherData,
    location,
    fetchedAt: now,
    expiresAt: now + WEATHER_CACHE_TTL,
  };

  // Try IndexedDB
  try {
    const db = await getDB();
    if (db) {
      await db.put(WEATHER_STORE, entry, "latest");
    }
  } catch (err) {
    console.warn("[WeatherStore] Failed to save to IndexedDB:", err);
  }

  // Always keep localStorage updated as fallback
  try {
    localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(entry));
  } catch (err) {
    console.warn("[WeatherStore] Failed to save to localStorage:", err);
  }
}

export function isCacheValid(entry: WeatherCacheEntry | null): boolean {
  if (!entry || !entry.weatherData) return false;
  return Date.now() < entry.expiresAt;
}

// ----------------------------------------------------
// Location Preference Functions
// ----------------------------------------------------

export async function getStoredWeatherLocation(): Promise<WeatherLocation> {
  if (typeof window === "undefined") return DEFAULT_LOCATION;

  // Try IndexedDB
  try {
    const db = await getDB();
    if (db) {
      const loc = (await db.get(PREFS_STORE, "location")) as WeatherLocation | undefined;
      if (loc && loc.latitude && loc.longitude) {
        return loc;
      }
    }
  } catch (err) {
    console.warn("[WeatherStore] Failed to read location from IndexedDB:", err);
  }

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LOCATION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WeatherLocation;
      if (parsed && parsed.latitude && parsed.longitude) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[WeatherStore] Failed to read location from localStorage:", err);
  }

  return DEFAULT_LOCATION;
}

export async function setStoredWeatherLocation(location: WeatherLocation): Promise<void> {
  if (typeof window === "undefined") return;

  // Try IndexedDB
  try {
    const db = await getDB();
    if (db) {
      await db.put(PREFS_STORE, location, "location");
    }
  } catch (err) {
    console.warn("[WeatherStore] Failed to save location to IndexedDB:", err);
  }

  // Fallback to localStorage
  try {
    localStorage.setItem(LOCAL_STORAGE_LOCATION_KEY, JSON.stringify(location));
  } catch (err) {
    console.warn("[WeatherStore] Failed to save location to localStorage:", err);
  }
}

// ----------------------------------------------------
// Temperature Unit Preference Functions
// ----------------------------------------------------

export function getStoredTempUnit(): TemperatureUnit {
  if (typeof window === "undefined") return "C";
  try {
    const unit = localStorage.getItem(LOCAL_STORAGE_TEMP_UNIT_KEY);
    if (unit === "C" || unit === "F") return unit;
  } catch (err) {
    console.warn("[WeatherStore] Failed to read temp unit:", err);
  }
  return "C";
}

export function setStoredTempUnit(unit: TemperatureUnit): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_TEMP_UNIT_KEY, unit);
  } catch (err) {
    console.warn("[WeatherStore] Failed to save temp unit:", err);
  }
}
