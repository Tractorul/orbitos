"use client";

import { useState, useEffect, useTransition } from "react";
import {
  MapPin,
  Search,
  Navigation,
  X,
  Check,
  Loader2,
  Building2,
} from "lucide-react";
import { WeatherLocation } from "@/types/weather";
import { searchOpenMeteoLocations } from "@/lib/weather/openMeteo";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: WeatherLocation;
  onSelectLocation: (loc: WeatherLocation) => void;
  onRequestGps: () => Promise<boolean>;
}

const PRESET_ROMANIAN_CITIES: WeatherLocation[] = [
  {
    name: "București",
    admin1: "București",
    country: "România",
    latitude: 44.4323,
    longitude: 26.1063,
    source: "manual",
  },
  {
    name: "Cluj-Napoca",
    admin1: "Cluj",
    country: "România",
    latitude: 46.7712,
    longitude: 23.6236,
    source: "manual",
  },
  {
    name: "Timișoara",
    admin1: "Timiș",
    country: "România",
    latitude: 45.7537,
    longitude: 21.2257,
    source: "manual",
  },
  {
    name: "Iași",
    admin1: "Iași",
    country: "România",
    latitude: 47.1585,
    longitude: 27.6014,
    source: "manual",
  },
  {
    name: "Brașov",
    admin1: "Brașov",
    country: "România",
    latitude: 45.6579,
    longitude: 25.6012,
    source: "manual",
  },
  {
    name: "Constanța",
    admin1: "Constanța",
    country: "România",
    latitude: 44.1792,
    longitude: 28.6498,
    source: "manual",
  },
  {
    name: "Craiova",
    admin1: "Dolj",
    country: "România",
    latitude: 44.3302,
    longitude: 23.7949,
    source: "manual",
  },
  {
    name: "Sibiu",
    admin1: "Sibiu",
    country: "România",
    latitude: 45.7983,
    longitude: 24.1256,
    source: "manual",
  },
  {
    name: "Oradea",
    admin1: "Bihor",
    country: "România",
    latitude: 47.0465,
    longitude: 21.9189,
    source: "manual",
  },
  {
    name: "Galați",
    admin1: "Galați",
    country: "România",
    latitude: 45.4353,
    longitude: 28.0076,
    source: "manual",
  },
];

export function LocationPickerModal({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onRequestGps,
}: LocationPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WeatherLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
      setIsGpsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchOpenMeteoLocations(searchQuery);
        startTransition(() => {
          setSearchResults(results);
          setIsSearching(false);
        });
      } catch {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleGpsClick = async () => {
    setIsGpsLoading(true);
    const success = await onRequestGps();
    setIsGpsLoading(false);
    if (success) {
      onClose();
    }
  };

  const isSelected = (loc: WeatherLocation) => {
    const latDiff = Math.abs(loc.latitude - currentLocation.latitude);
    const lonDiff = Math.abs(loc.longitude - currentLocation.longitude);
    return latDiff < 0.05 && lonDiff < 0.05;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#0C121E]/95 border border-white/[0.1] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-nord-8/15 border border-nord-8/30 text-nord-8 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-nord-6">
                Alege Locația Meteo
              </h3>
              <p className="text-[11px] text-nord-4/60">
                Prognoză exactă Open-Meteo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-nord-4 hover:text-nord-6 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar & GPS Trigger */}
        <div className="p-4 border-b border-white/[0.06] space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-nord-4/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Caută oraș (ex. Brașov, Constanța, Viena)..."
              className="w-full bg-[#111A2E] border border-white/[0.08] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none focus:border-nord-8/50 focus:ring-1 focus:ring-nord-8/50 transition-all"
              autoFocus
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 text-nord-8 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>

          <button
            onClick={handleGpsClick}
            disabled={isGpsLoading}
            className="w-full py-2.5 px-3 rounded-xl bg-nord-8/10 hover:bg-nord-8/20 border border-nord-8/25 text-nord-8 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isGpsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>Folosește Locația Curentă (GPS)</span>
          </button>
        </div>

        {/* Results / Presets Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {searchQuery.trim().length >= 2 ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-nord-4/50 mb-2 px-1">
                Rezultate Căutare ({searchResults.length})
              </p>
              {searchResults.length === 0 && !isSearching ? (
                <div className="text-center py-8 text-nord-4/60 text-xs">
                  <p className="font-semibold text-nord-5">Niciun oraș găsit</p>
                  <p className="mt-1 text-[11px]">
                    Încearcă o altă denumire de oraș sau localitate.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {searchResults.map((loc, idx) => {
                    const active = isSelected(loc);
                    return (
                      <button
                        key={`${loc.name}-${loc.latitude}-${idx}`}
                        onClick={() => {
                          onSelectLocation(loc);
                          onClose();
                        }}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                          active
                            ? "bg-nord-8/15 border-nord-8/40 text-nord-6"
                            : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.06] hover:border-nord-8/30 text-nord-4"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Building2
                            className={`w-4 h-4 shrink-0 ${
                              active ? "text-nord-8" : "text-nord-4/40 group-hover:text-nord-8"
                            }`}
                          />
                          <div className="min-w-0">
                            <p
                              className={`text-xs sm:text-sm font-semibold truncate ${
                                active ? "text-nord-6" : "text-nord-5 group-hover:text-nord-6"
                              }`}
                            >
                              {loc.name}
                            </p>
                            <p className="text-[11px] text-nord-4/50 truncate">
                              {[loc.admin1, loc.country].filter(Boolean).join(", ")}
                            </p>
                          </div>
                        </div>
                        {active && (
                          <div className="w-5 h-5 rounded-full bg-nord-8 text-[#070A0F] flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-nord-4/50 mb-2 px-1">
                Orașe Populare (România)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_ROMANIAN_CITIES.map((loc) => {
                  const active = isSelected(loc);
                  return (
                    <button
                      key={loc.name}
                      onClick={() => {
                        onSelectLocation(loc);
                        onClose();
                      }}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                        active
                          ? "bg-nord-8/15 border-nord-8/40 text-nord-6"
                          : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.06] hover:border-nord-8/30 text-nord-4"
                      }`}
                    >
                      <div className="min-w-0">
                        <p
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            active ? "text-nord-6" : "text-nord-5 group-hover:text-nord-6"
                          }`}
                        >
                          {loc.name}
                        </p>
                        <p className="text-[10px] text-nord-4/40 truncate">
                          {loc.admin1}
                        </p>
                      </div>
                      {active && (
                        <div className="w-4 h-4 rounded-full bg-nord-8 text-[#070A0F] flex items-center justify-center shrink-0 ml-1">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
