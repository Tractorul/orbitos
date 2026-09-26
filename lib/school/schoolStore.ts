import { SchoolPeriod, SchoolProfile } from "@/types/school";
import { DEFAULT_8G_SCHEDULE, DEFAULT_SCHOOL_PROFILE, TEACHERS_DATABASE } from "./defaultData";

const SCHEDULE_STORAGE_KEY = "orbit_school_schedule_v1";
const PROFILE_STORAGE_KEY = "orbit_school_profile_v1";

export function getStoredSchoolProfile(): SchoolProfile {
  if (typeof window === "undefined") {
    return DEFAULT_SCHOOL_PROFILE;
  }
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Failed to parse school profile from storage", err);
  }
  return DEFAULT_SCHOOL_PROFILE;
}

export function saveStoredSchoolProfile(profile: SchoolProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn("Failed to save school profile to storage", err);
  }
}

export function getStoredSchoolSchedule(): SchoolPeriod[] {
  if (typeof window === "undefined") {
    return DEFAULT_8G_SCHEDULE;
  }
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to parse school schedule from storage", err);
  }
  return DEFAULT_8G_SCHEDULE;
}

export function saveStoredSchoolSchedule(schedule: SchoolPeriod[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedule));
  } catch (err) {
    console.warn("Failed to save school schedule to storage", err);
  }
}

export function resetStoredSchoolSchedule(): SchoolPeriod[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SCHEDULE_STORAGE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  }
  return DEFAULT_8G_SCHEDULE;
}

export function lookupTeacher(subject: string): string {
  const trimmed = subject.trim();
  return TEACHERS_DATABASE[trimmed] || "";
}
