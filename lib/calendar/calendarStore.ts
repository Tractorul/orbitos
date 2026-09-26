import { CalendarEvent } from "@/types/calendar";

const CALENDAR_STORAGE_KEY = "orbit_calendar_v1";
const CALENDAR_EVENT = "orbit_calendar_updated";

const DEMO_EVENT_IDS = new Set(["event-1", "event-2", "event-3", "1", "2", "3"]);

export function getDefaultCalendarEvents(): CalendarEvent[] {
  return [];
}

export function getStoredCalendarEvents(): CalendarEvent[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(CALENDAR_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((e) => !DEMO_EVENT_IDS.has(e.id));
        if (cleaned.length !== parsed.length) {
          saveStoredCalendarEvents(cleaned);
        }
        return cleaned;
      }
    }
  } catch (err) {
    console.warn("[calendarStore] Failed to read events from localStorage", err);
  }
  return [];
}

export function saveStoredCalendarEvents(events: CalendarEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events));
    window.dispatchEvent(new Event(CALENDAR_EVENT));
  } catch (err) {
    console.warn("[calendarStore] Failed to save events to localStorage", err);
  }
}

export function addCalendarEvent(event: Omit<CalendarEvent, "id" | "createdAt">): CalendarEvent {
  const current = getStoredCalendarEvents();
  const newEvent: CalendarEvent = {
    ...event,
    id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newEvent, ...current];
  saveStoredCalendarEvents(updated);
  return newEvent;
}

export function updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): void {
  const current = getStoredCalendarEvents();
  const updated = current.map((e) => (e.id === id ? { ...e, ...updates } : e));
  saveStoredCalendarEvents(updated);
}

export function deleteCalendarEvent(id: string): void {
  const current = getStoredCalendarEvents();
  const updated = current.filter((e) => e.id !== id);
  saveStoredCalendarEvents(updated);
}

export function subscribeToCalendar(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CALENDAR_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CALENDAR_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
