"use client";

import { useState, useEffect } from "react";
import {
  Palette,
  Bell,
  GraduationCap,
  Database,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { SchoolScheduleManager } from "@/components/school/SchoolScheduleManager";
import { LocationPickerModal } from "@/components/weather/LocationPickerModal";
import { DataBackupManager } from "@/components/settings/DataBackupManager";
import { useWeather } from "@/lib/weather/useWeather";
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendBrowserNotification,
  NotificationPermissionState,
} from "@/lib/notifications/notificationService";
import { t } from "@/lib/i18n";

export default function MorePage() {
  const {
    location,
    tempUnit,
    setTempUnit,
    setManualLocation,
    requestGeolocation,
  } = useWeather();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [notificationState, setNotificationState] = useState<NotificationPermissionState>("default");

  useEffect(() => {
    setNotificationState(getNotificationPermission());
  }, []);

  const handleToggleNotifications = async () => {
    if (notificationState === "granted") {
      sendBrowserNotification("Orbit • Test Notificare", {
        body: "Notificările browserului funcționează perfect!",
      });
    } else {
      const result = await requestNotificationPermission();
      setNotificationState(result);
      if (result === "granted") {
        sendBrowserNotification("Orbit • Notificări activate", {
          body: "Vei primi mementouri pentru cursuri și sarcini.",
        });
      }
    }
  };

  return (
    <div className="space-y-5 animate-fade-in pb-8">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-xl sm:text-2xl font-bold text-nord-6 tracking-tight">
          {t.settings.title}
        </h1>
        <p className="text-xs text-nord-4/60 font-medium mt-0.5">{t.settings.subtitle}</p>
      </div>

      {/* 1. School Schedule & Profile Section */}
      <div id="school" className="space-y-2.5">
        <div className="flex items-center gap-2 px-1">
          <GraduationCap className="w-4 h-4 text-nord-8" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-nord-8/90">
            {t.school.title}
          </h2>
        </div>
        <SchoolScheduleManager />
      </div>

      {/* 2. Grouped Settings Sections (iOS Style Inset Glass Panels) */}

      {/* Section: Preferințe & Vreme */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-nord-4/60 px-2">
          Preferințe &amp; Vreme
        </p>

        <GlassCard className="p-0 overflow-hidden divide-y divide-white/[0.06]">
          {/* Appearance Row */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-nord-9/15 text-nord-9 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-nord-6">
                  {t.settings.appearance.theme}
                </p>
                <p className="text-[11px] text-nord-4/50">{t.settings.appearance.description}</p>
              </div>
            </div>
            <Badge variant="blue" size="sm">
              Nord Frost
            </Badge>
          </div>

          {/* Weather Location Row */}
          <div
            onClick={() => setIsLocationModalOpen(true)}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-nord-7/15 text-nord-7 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-nord-6">
                  {t.settings.weatherConfig.location}
                </p>
                <p className="text-[11px] text-nord-4/50">
                  {location.source === "gps"
                    ? "Locație GPS automată"
                    : location.source === "manual"
                    ? "Oraș selectat manual"
                    : "Locație prestabilită"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-nord-8 font-semibold group-hover:underline">
              <span>{location.name}</span>
              <ChevronRight className="w-3.5 h-3.5 text-nord-4/40 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Temperature Unit Switcher */}
          <div className="p-3.5 px-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-nord-6">
              {t.settings.weatherConfig.unit}
            </span>
            <div className="flex gap-1 bg-[#0E1524] p-1 rounded-xl border border-white/[0.08]">
              <button
                onClick={() => setTempUnit("C")}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  tempUnit === "C"
                    ? "bg-nord-8 text-[#070A0F] shadow-[0_2px_8px_rgba(136,192,208,0.3)]"
                    : "text-nord-4/70 hover:text-nord-6"
                }`}
              >
                °C (Celsius)
              </button>
              <button
                onClick={() => setTempUnit("F")}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  tempUnit === "F"
                    ? "bg-nord-8 text-[#070A0F] shadow-[0_2px_8px_rgba(136,192,208,0.3)]"
                    : "text-nord-4/70 hover:text-nord-6"
                }`}
              >
                °F (Fahrenheit)
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={location}
        onSelectLocation={setManualLocation}
        onRequestGps={requestGeolocation}
      />

      {/* Section: Notificări & Sistem */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-nord-4/60 px-2">
          Sistem &amp; Notificări
        </p>

        <GlassCard className="p-0 overflow-hidden divide-y divide-white/[0.06]">
          {/* Notifications Row */}
          <div
            onClick={handleToggleNotifications}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-nord-13/15 text-nord-13 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-nord-6">
                  {t.settings.notifications.browserAlerts}
                </p>
                <p className="text-[11px] text-nord-4/50">
                  {notificationState === "granted"
                    ? "Notificările sunt active (Apasă pentru test)"
                    : notificationState === "denied"
                    ? "Blocate în browser"
                    : "Apasă pentru a permite alertele"}
                </p>
              </div>
            </div>
            <Badge
              variant={
                notificationState === "granted"
                  ? "green"
                  : notificationState === "denied"
                  ? "red"
                  : "outline"
              }
              size="sm"
              dot={notificationState === "granted"}
            >
              {notificationState === "granted"
                ? "Permis"
                : notificationState === "denied"
                ? "Blocat"
                : "Activează"}
            </Badge>
          </div>

          {/* Local Storage / IndexedDB */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-nord-14/15 text-nord-14 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-nord-6">
                  {t.settings.data.indexedDB}
                </p>
                <p className="text-[11px] text-nord-4/50">{t.settings.data.description}</p>
              </div>
            </div>
            <Badge variant="green" size="sm" dot>
              {t.settings.data.statusReady}
            </Badge>
          </div>
        </GlassCard>
      </div>

      {/* Section: Data Backup & Restore Manager */}
      <DataBackupManager />

      {/* Section: Despre Orbit */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-nord-4/60 px-2">
          {t.settings.about.title}
        </p>

        <GlassCard className="p-4 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-nord-4/70">{t.settings.about.version}</span>
            <span className="text-nord-6 font-mono font-bold bg-white/[0.06] px-2 py-0.5 rounded-lg border border-white/[0.08] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-nord-8" />
              1.2.0 (Pro Upgrade)
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-nord-4/70">{t.settings.about.design}</span>
            <span className="text-nord-6 font-medium">{t.settings.about.designVal}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-nord-4/70">{t.settings.about.architecture}</span>
            <span className="text-nord-6 font-medium">{t.settings.about.archVal}</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
