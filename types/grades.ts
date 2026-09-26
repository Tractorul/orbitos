export type GradeType = "oral" | "test" | "teza" | "proiect";

export interface GradeEntry {
  id: string;
  subject: string;
  value: number; // 1 - 10
  date: string; // YYYY-MM-DD
  type: GradeType;
  notes?: string;
  createdAt: string;
}

export interface SubjectGradesSummary {
  subject: string;
  grades: GradeEntry[];
  average: number | null;
}
