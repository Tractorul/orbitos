"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarEvent } from "@/types/calendar";
import {
  getStoredCalendarEvents,
  addCalendarEvent as storeAddEvent,
  updateCalendarEvent as storeUpdateEvent,
  deleteCalendarEvent as storeDeleteEvent,
  subscribeToCalendar,
} from "./calendarStore";

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    const data = getStoredCalendarEvents();
    setEvents(data);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribeToCalendar(refresh);
    return () => unsubscribe();
  }, [refresh]);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id" | "createdAt">) => {
    return storeAddEvent(event);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    storeUpdateEvent(id, updates);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    storeDeleteEvent(id);
  }, []);

  return {
    events,
    isLoaded,
    addEvent,
    updateEvent,
    deleteEvent,
    refresh,
  };
}
