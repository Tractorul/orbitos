export type DayOfWeek = "Luni" | "Marți" | "Miercuri" | "Joi" | "Vineri" | "Sâmbătă" | "Duminică";

export interface Teacher {
  subject: string;
  name: string;
}

export interface SchoolPeriod {
  id: string;
  day: DayOfWeek;
  startTime: string; // e.g., "12:30"
  endTime: string;   // e.g., "13:20"
  subject: string;   // e.g., "Mate", "Română"
  fullSubject?: string; // e.g., "Matematică"
  teacher: string;   // e.g., "Voiasciuc Oana"
  room?: string;
}

export interface SchoolProfile {
  className: string;      // "8G"
  shift: string;          // "Schimbul II"
  schoolYear: string;     // "2026–2027"
  homeroomTeacher: string;// "Bicosu Ilona"
}

export interface ClassStatusResult {
  status: "now" | "upcoming" | "ended_today" | "weekend" | "no_classes";
  currentPeriod?: SchoolPeriod;
  nextPeriod?: SchoolPeriod;
  minutesUntilNext?: number;
  endsAt?: string;
  nextDayName?: DayOfWeek;
  nextDayDateString?: string;
  todaysPeriods: SchoolPeriod[];
}
