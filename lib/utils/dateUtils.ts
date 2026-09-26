export const RO_MONTH_NAMES = [
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie",
];

export const RO_DAY_NAMES = [
  "Duminică",
  "Luni",
  "Marți",
  "Miercuri",
  "Joi",
  "Vineri",
  "Sâmbătă",
];

export const RO_DAY_NAMES_SHORT = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatRomanianDate(dateOrStr: Date | string): string {
  const date = typeof dateOrStr === "string" ? new Date(dateOrStr) : dateOrStr;
  if (isNaN(date.getTime())) return "";
  const dayName = RO_DAY_NAMES[date.getDay()];
  const dayNum = date.getDate();
  const monthName = RO_MONTH_NAMES[date.getMonth()];
  return `${dayName}, ${dayNum} ${monthName}`;
}

export function formatRomanianShortDate(dateOrStr: Date | string): string {
  const date = typeof dateOrStr === "string" ? new Date(dateOrStr) : dateOrStr;
  if (isNaN(date.getTime())) return "";
  const dayNum = date.getDate();
  const monthName = RO_MONTH_NAMES[date.getMonth()];
  return `${dayNum} ${monthName}`;
}

export function getRelativeDateLabel(dateStr?: string): string {
  if (!dateStr) return "";
  const today = getTodayDateString();
  
  const todayDate = new Date(today);
  const targetDate = new Date(dateStr);
  
  const diffTime = targetDate.getTime() - todayDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Astăzi";
  if (diffDays === 1) return "Mâine";
  if (diffDays === -1) return "Ieri";
  if (diffDays > 1 && diffDays < 7) {
    return RO_DAY_NAMES[targetDate.getDay()];
  }
  return formatRomanianShortDate(targetDate);
}

export function isDateToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  return dateStr === getTodayDateString();
}

export function isDateUpcoming(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = getTodayDateString();
  return dateStr > today;
}

export function isDatePast(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = getTodayDateString();
  return dateStr < today;
}

export function getDaysOfWeek(centerDate: Date = new Date()): { date: Date; dateStr: string; dayName: string; dayNumber: number; isToday: boolean }[] {
  const currentDay = centerDate.getDay();
  // We start week from Monday (1) to Sunday (0)
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = new Date(centerDate);
  monday.setDate(centerDate.getDate() + mondayOffset);
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    
    days.push({
      date: d,
      dateStr,
      dayName: RO_DAY_NAMES_SHORT[d.getDay()],
      dayNumber: d.getDate(),
      isToday: isDateToday(dateStr),
    });
  }
  return days;
}
