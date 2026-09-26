"use client";

import { useState } from "react";
import {
  MapPin,
  CloudRain,
  Wind,
  RotateCw,
  AlertTriangle,
  WifiOff,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { WeatherIcon } from "./WeatherIcon";
import { LocationPickerModal } from "./LocationPickerModal";
import { useWeather } from "@/lib/weather/useWeather";
import { TemperatureUnit } from "@/types/weather";

function formatTemp(celsius: number, unit: TemperatureUnit): string {
  if (unit === "F") {
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);
    return `${fahrenheit}°`;
  }
  return `${celsius}°`;
}

export function WeatherCard() {
  const {
    weather,
    location,
    state,
    error,
    tempUnit,
    isRefreshing,
    refreshWeather,
    requestGeolocation,
    setManualLocation,
  } = useWeather();

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // 1. Loading Skeleton state (when no cached data is available yet)
  if (state === "loading" && !weather) {
    return (
      <GlassCard variant="accent" className="p-4 sm:p-5 relative overflow-hidden animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-3 w-3/5">
            <div className="h-3.5 bg-white/[0.08] rounded-md w-24" />
            <div className="h-10 bg-white/[0.08] rounded-xl w-32" />
            <div className="h-3 bg-white/[0.08] rounded-md w-44" />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/[0.08] shrink-0" />
        </div>
      </GlassCard>
    );
  }

  // 2. Error / Location Required State (if no weather data exists at all)
  if (!weather && (state === "error" || state === "location-required" || state === "location-denied")) {
    return (
      <>
        <GlassCard variant="default" className="p-4 sm:p-5 border-nord-11/30 bg-nord-11/5">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-nord-11/15 text-nord-11 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-nord-6">
                  {state === "location-denied"
                    ? "Locația GPS este inaccesibilă"
                    : "Nu am putut încărca datele meteo"}
                </p>
                <p className="text-[11px] text-nord-4/60 mt-0.5">
                  {error || "Verifică conexiunea la internet sau alege manual un oraș."}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setIsPickerOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-nord-8 text-[#070A0F] text-xs font-bold transition-all active:scale-95 shadow-[0_2px_10px_rgba(136,192,208,0.25)] hover:bg-nord-8/90"
                >
                  Alege o locație
                </button>
                <button
                  onClick={() => refreshWeather(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-nord-4 text-xs font-semibold border border-white/[0.08] transition-all"
                >
                  Reîncearcă
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        <LocationPickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          currentLocation={location}
          onSelectLocation={setManualLocation}
          onRequestGps={requestGeolocation}
        />
      </>
    );
  }

  // 3. Main Weather View (Live, Cached, Stale, or Offline)
  const current = weather?.current;
  const todayForecast = weather?.daily?.[0];
  const upcomingDaily = weather?.daily?.slice(1, 4) || [];

  return (
    <>
      <GlassCard
        variant="accent"
        className="p-4 sm:p-5 relative overflow-hidden group transition-all duration-300"
      >
        {/* Top Header: Location + Status indicators */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setIsPickerOpen(true)}
            className="flex items-center gap-1.5 text-xs text-nord-4/80 hover:text-nord-8 font-medium transition-colors group/loc py-0.5 px-1.5 -ml-1.5 rounded-lg hover:bg-white/[0.04]"
          >
            <MapPin className="w-3.5 h-3.5 text-nord-8 shrink-0 group-hover/loc:scale-110 transition-transform" />
            <span className="font-semibold text-nord-6 truncate max-w-[160px] sm:max-w-[220px]">
              {location.name}
            </span>
            <ChevronDown className="w-3 h-3 text-nord-4/40 group-hover/loc:text-nord-8 transition-colors" />
          </button>

          <div className="flex items-center gap-1.5">
            {state === "offline" && (
              <Badge variant="outline" size="sm" className="text-[10px] text-nord-13 border-nord-13/30 bg-nord-13/10 gap-1">
                <WifiOff className="w-2.5 h-2.5" />
                <span>Offline</span>
              </Badge>
            )}
            {state === "stale" && (
              <Badge variant="outline" size="sm" className="text-[10px] text-nord-4/60 border-white/[0.08]">
                Cache
              </Badge>
            )}
            <button
              onClick={() => refreshWeather(true)}
              disabled={isRefreshing}
              aria-label="Actualizează vremea"
              className="p-1 rounded-lg text-nord-4/40 hover:text-nord-8 hover:bg-white/[0.05] transition-all disabled:opacity-40"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-nord-8" : ""}`} />
            </button>
          </div>
        </div>

        {/* Hero Section: Temp, Condition, Apparent, and Main Icon */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-light tracking-tighter text-nord-6">
                {current ? formatTemp(current.temperature, tempUnit) : "--"}
              </span>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-semibold text-nord-5 leading-tight">
                  {current?.weatherDescription || "Nespecificat"}
                </span>
                {current && (
                  <span className="text-[11px] text-nord-4/60 font-medium">
                    Se simte ca {formatTemp(current.apparentTemperature, tempUnit)}
                  </span>
                )}
              </div>
            </div>

            {/* Quick stats: Max/Min, Rain %, Wind */}
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 pt-2 text-xs text-nord-4/75 font-medium">
              {todayForecast && (
                <span className="font-mono">
                  Max: {formatTemp(todayForecast.tempMax, tempUnit)} • Min:{" "}
                  {formatTemp(todayForecast.tempMin, tempUnit)}
                </span>
              )}

              {current && (
                <span className="flex items-center gap-1 text-nord-8">
                  <CloudRain className="w-3.5 h-3.5" />
                  {current.precipitationProbability}% precipitații
                </span>
              )}

              {current && (
                <span className="flex items-center gap-1 text-nord-4/60">
                  <Wind className="w-3.5 h-3.5" />
                  {current.windSpeed} km/h
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Weather Icon with Glowing Ambient Pill */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-nord-8/20 to-nord-10/20 border border-nord-8/30 text-nord-8 shadow-[0_0_20px_rgba(136,192,208,0.25)] shrink-0 group-hover:scale-105 transition-transform duration-300">
            {current ? (
              <WeatherIcon
                code={current.weatherCode}
                isDay={current.isDay}
                className="w-9 h-9 sm:w-10 sm:h-10"
              />
            ) : (
              <Sparkles className="w-9 h-9" />
            )}
          </div>
        </div>

        {/* 3-Day Mini Forecast Row */}
        {upcomingDaily.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/[0.08] grid grid-cols-3 gap-2">
            {upcomingDaily.map((day) => (
              <div
                key={day.date}
                className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col items-center justify-between text-center gap-1"
              >
                <span className="text-[11px] font-semibold text-nord-4/80">
                  {day.dayName}
                </span>
                <WeatherIcon
                  code={day.weatherCode}
                  isDay={true}
                  className="w-5 h-5 text-nord-8 my-0.5"
                />
                <div className="flex items-center gap-1 text-[10px] font-mono text-nord-5">
                  <span className="font-bold">{formatTemp(day.tempMax, tempUnit)}</span>
                  <span className="text-nord-4/40">{formatTemp(day.tempMin, tempUnit)}</span>
                </div>
                {day.precipitationProbabilityMax > 0 && (
                  <span className="text-[9px] text-nord-8 flex items-center gap-0.5 font-medium">
                    <CloudRain className="w-2.5 h-2.5" />
                    {day.precipitationProbabilityMax}%
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Location Picker Modal Sheet */}
      <LocationPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        currentLocation={location}
        onSelectLocation={setManualLocation}
        onRequestGps={requestGeolocation}
      />
    </>
  );
}
