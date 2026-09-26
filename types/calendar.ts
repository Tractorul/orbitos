export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location?: string;
  hasReminder: boolean;
  colorTag?: "cyan" | "blue" | "green" | "yellow" | "red" | "purple";
  createdAt: string;
}
