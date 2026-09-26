import { ro } from "./translations/ro";
import { en } from "./translations/en";

export type Locale = "ro-RO" | "en-US";

export const translations = {
  "ro-RO": ro,
  "en-US": en,
};

// Default application locale
export const DEFAULT_LOCALE: Locale = "ro-RO";

export function getDictionary(locale: Locale = DEFAULT_LOCALE) {
  return translations[locale] || translations["ro-RO"];
}

// Global quick accessor for active locale strings
export const t = getDictionary(DEFAULT_LOCALE);

/**
 * Format date in Romanian locale (e.g. "joi, 25 septembrie")
 */
export function formatRomanianDate(date: Date, capitalizeFirst = true): string {
  const formatter = new Intl.DateTimeFormat("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const formatted = formatter.format(date);
  if (capitalizeFirst && formatted.length > 0) {
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  return formatted;
}

/**
 * Format time in 24-hour Romanian format (e.g. "13:30")
 */
export function formatRomanianTime(date: Date): string {
  return new Intl.DateTimeFormat("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Get natural Romanian greeting based on time of day
 */
export function getRomanianGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return ro.header.greetings.morning; // "Bună dimineața"
  } else if (hour >= 12 && hour < 17) {
    return ro.header.greetings.afternoon; // "Bună ziua"
  } else if (hour >= 17 && hour < 22) {
    return ro.header.greetings.evening; // "Bună seara"
  } else {
    return ro.header.greetings.night; // "Noapte bună"
  }
}

/**
 * Format relative day label (Astăzi, Mâine, or weekday)
 */
export function formatRelativeDay(targetDate: Date, baseDate: Date = new Date()): string {
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
  const base = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate()).getTime();
  const diffDays = Math.round((target - base) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Astăzi";
  if (diffDays === 1) return "Mâine";
  if (diffDays === -1) return "Ieri";

  return formatRomanianDate(targetDate);
}
