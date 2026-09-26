"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  WeatherData,
  WeatherLocation,
  WeatherState,
  TemperatureUnit,
} from "@/types/weather";
import {
  fetchOpenMeteoForecast,
} from "./openMeteo";
import {
  getCachedWeather,
  setCachedWeather,
  isCacheValid,
  getStoredWeatherLocation,
  setStoredWeatherLocation,
  getStoredTempUnit,
  setStoredTempUnit,
  DEFAULT_LOCATION,
} from "./weatherStore";

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<WeatherLocation>(DEFAULT_LOCATION);
  const [state, setState] = useState<WeatherState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [tempUnit, setTempUnitState] = useState<TemperatureUnit>("C");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeLocationRef = useRef<WeatherLocation>(DEFAULT_LOCATION);
  const isFetchingRef = useRef(false);

  // Synchronize ref
  activeLocationRef.current = location;

  const fetchWeatherForLocation = useCallback(
    async (targetLocation: WeatherLocation, isBackground = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (!isBackground) {
        setIsRefreshing(true);
      }

      const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
      if (!isOnline) {
        setState("offline");
        setIsRefreshing(false);
        isFetchingRef.current = false;
        return;
      }

      try {
        const data = await fetchOpenMeteoForecast(targetLocation);
        setWeather(data);
        await setCachedWeather(data, targetLocation);
        setState("success");
        setError(null);
      } catch (err: unknown) {
        console.warn("[useWeather] Fetch error:", err);
        const errMsg =
          err instanceof Error ? err.message : "Nu am putut descărca datele meteo.";
        setError(errMsg);

        // If we have cached data, fall back to stale state instead of total failure
        setWeather((currentWeather) => {
          if (currentWeather) {
            setState("stale");
            return currentWeather;
          }
          setState("error");
          return null;
        });
      } finally {
        setIsRefreshing(false);
        isFetchingRef.current = false;
      }
    },
    []
  );

  // 1. Initial hydration and cache load
  useEffect(() => {
    let isMounted = true;

    async function init() {
      // 1. Load preferences
      const savedUnit = getStoredTempUnit();
      const savedLoc = await getStoredWeatherLocation();
      if (!isMounted) return;

      setTempUnitState(savedUnit);
      setLocation(savedLoc);
      activeLocationRef.current = savedLoc;

      // 2. Read local cache
      const cached = await getCachedWeather();
      if (!isMounted) return;

      const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

      if (cached && cached.weatherData) {
        setWeather(cached.weatherData);
        if (!isOnline) {
          setState("offline");
        } else if (isCacheValid(cached)) {
          setState("success");
        } else {
          setState("stale");
          // Refresh stale data in background
          fetchWeatherForLocation(savedLoc, true);
        }
      } else {
        // No cache available
        if (!isOnline) {
          setState("offline");
        } else {
          setState("loading");
          fetchWeatherForLocation(savedLoc, false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [fetchWeatherForLocation]);

  // 2. Online / Offline listeners
  useEffect(() => {
    function handleOnline() {
      if (state === "offline" || state === "stale" || state === "error") {
        fetchWeatherForLocation(activeLocationRef.current, false);
      }
    }

    function handleOffline() {
      setState("offline");
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [state, fetchWeatherForLocation]);

  // 3. Visibility change listener (refreshes if tab was hidden and cache expired)
  useEffect(() => {
    async function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        const cached = await getCachedWeather();
        if (!isCacheValid(cached)) {
          fetchWeatherForLocation(activeLocationRef.current, true);
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchWeatherForLocation]);

  // Public methods
  const refreshWeather = useCallback(
    async (force = true) => {
      if (force) {
        await fetchWeatherForLocation(activeLocationRef.current, false);
      } else {
        const cached = await getCachedWeather();
        if (!isCacheValid(cached)) {
          await fetchWeatherForLocation(activeLocationRef.current, false);
        }
      }
    },
    [fetchWeatherForLocation]
  );

  const setManualLocation = useCallback(
    async (newLoc: WeatherLocation) => {
      setLocation(newLoc);
      activeLocationRef.current = newLoc;
      await setStoredWeatherLocation(newLoc);
      await fetchWeatherForLocation(newLoc, false);
    },
    [fetchWeatherForLocation]
  );

  const requestGeolocation = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setError("Geolocalizarea nu este suportată de browser.");
      setState("location-denied");
      return false;
    }

    setIsRefreshing(true);
    setState("loading");

    return new Promise<boolean>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const gpsLoc: WeatherLocation = {
            name: "Locația curentă (GPS)",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            source: "gps",
          };
          setLocation(gpsLoc);
          activeLocationRef.current = gpsLoc;
          await setStoredWeatherLocation(gpsLoc);
          await fetchWeatherForLocation(gpsLoc, false);
          resolve(true);
        },
        (geoError) => {
          console.warn("[useWeather] Geolocation error:", geoError);
          setIsRefreshing(false);
          if (geoError.code === geoError.PERMISSION_DENIED) {
            setState("location-denied");
            setError("Accesul la locație a fost refuzat. Poți alege un oraș manual.");
          } else {
            setState("location-required");
            setError("Nu am putut determina locația GPS. Te rugăm să alegi un oraș.");
          }
          resolve(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 10 * 60 * 1000,
        }
      );
    });
  }, [fetchWeatherForLocation]);

  const setTempUnit = useCallback((unit: TemperatureUnit) => {
    setTempUnitState(unit);
    setStoredTempUnit(unit);
  }, []);

  return {
    weather,
    location,
    state,
    error,
    tempUnit,
    isRefreshing,
    refreshWeather,
    requestGeolocation,
    setManualLocation,
    setTempUnit,
  };
}
