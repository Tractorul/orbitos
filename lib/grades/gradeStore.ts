import { GradeEntry, SubjectGradesSummary } from "@/types/grades";

const GRADES_STORAGE_KEY = "orbit_grades_v1";
const GRADES_EVENT = "orbit_grades_updated";

const DEMO_GRADE_IDS = new Set(["grade-1", "grade-2", "grade-3", "grade-4", "grade-5", "grade-6"]);

export const DEFAULT_SCHOOL_SUBJECTS = [
  "Română",
  "Matematică",
  "Engleză",
  "Franceză",
  "Fizică",
  "Chimie",
  "Biologie",
  "Istorie",
  "Geografie",
  "TIC",
  "Educație Fizică",
  "Educație Plastică",
  "Educație Muzicală",
  "Religie",
  "Educație Socială",
];

export function getDefaultGrades(): GradeEntry[] {
  return [];
}

export function getStoredGrades(): GradeEntry[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(GRADES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((g) => !DEMO_GRADE_IDS.has(g.id));
        if (cleaned.length !== parsed.length) {
          saveStoredGrades(cleaned);
        }
        return cleaned;
      }
    }
  } catch (err) {
    console.warn("[gradeStore] Failed to read grades from localStorage", err);
  }
  return [];
}

export function saveStoredGrades(grades: GradeEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(grades));
    window.dispatchEvent(new Event(GRADES_EVENT));
  } catch (err) {
    console.warn("[gradeStore] Failed to save grades to localStorage", err);
  }
}

export function addGrade(grade: Omit<GradeEntry, "id" | "createdAt">): GradeEntry {
  const current = getStoredGrades();
  const newGrade: GradeEntry = {
    ...grade,
    id: `grade-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newGrade, ...current];
  saveStoredGrades(updated);
  return newGrade;
}

export function deleteGrade(id: string): void {
  const current = getStoredGrades();
  const updated = current.filter((g) => g.id !== id);
  saveStoredGrades(updated);
}

export function calculateSubjectAverage(grades: GradeEntry[]): number | null {
  if (grades.length === 0) return null;
  const sum = grades.reduce((acc, g) => acc + g.value, 0);
  return Number((sum / grades.length).toFixed(2));
}

export function calculateGeneralAverage(summaries: SubjectGradesSummary[]): number | null {
  const validSummaries = summaries.filter((s) => s.average !== null && s.average > 0);
  if (validSummaries.length === 0) return null;
  const sum = validSummaries.reduce((acc, s) => acc + (s.average || 0), 0);
  return Number((sum / validSummaries.length).toFixed(2));
}

export function subscribeToGrades(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(GRADES_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(GRADES_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
