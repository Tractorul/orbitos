import { DayOfWeek, SchoolPeriod, ClassStatusResult } from "@/types/school";

export const DAY_NAMES: Record<number, DayOfWeek> = {
  0: "Duminică",
  1: "Luni",
  2: "Marți",
  3: "Miercuri",
  4: "Joi",
  5: "Vineri",
  6: "Sâmbătă",
};

export const SCHOOL_DAYS: DayOfWeek[] = ["Luni", "Marți", "Miercuri", "Joi", "Vineri"];

export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function formatMinutesCountdown(minutes: number): string {
  if (minutes <= 1) {
    return "în mai puțin de un minut";
  }
  if (minutes < 60) {
    return `în ${minutes} de minute`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return hours === 1 ? "într-o oră" : `în ${hours} ore`;
  }
  const hourText = hours === 1 ? "o oră" : `${hours} ore`;
  return `în ${hourText} și ${remainingMins} min`;
}

export function getDayClasses(
  schedule: SchoolPeriod[],
  day: DayOfWeek
): SchoolPeriod[] {
  return schedule
    .filter((p) => p.day === day)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
}

export function getNextSchoolDay(currentDayIndex: number): DayOfWeek {
  // 0 = Dum, 1 = Lun, 2 = Mar, 3 = Mie, 4 = Joi, 5 = Vin, 6 = Sam
  if (currentDayIndex >= 5 || currentDayIndex === 0) {
    // Friday after hours or Saturday/Sunday -> next is Luni
    return "Luni";
  }
  return DAY_NAMES[currentDayIndex + 1] || "Luni";
}

export function getCurrentOrNextClass(
  schedule: SchoolPeriod[],
  now: Date = new Date()
): ClassStatusResult {
  const currentDayIndex = now.getDay();
  const currentDayName = DAY_NAMES[currentDayIndex];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const isWeekend = currentDayIndex === 0 || currentDayIndex === 6;

  if (isWeekend) {
    const nextDay = "Luni";
    const nextDayClasses = getDayClasses(schedule, nextDay);
    return {
      status: "weekend",
      nextDayName: nextDay,
      todaysPeriods: [],
      nextPeriod: nextDayClasses[0],
    };
  }

  const todaysClasses = getDayClasses(schedule, currentDayName);

  if (todaysClasses.length === 0) {
    const nextDay = getNextSchoolDay(currentDayIndex);
    const nextDayClasses = getDayClasses(schedule, nextDay);
    return {
      status: "no_classes",
      nextDayName: nextDay,
      todaysPeriods: [],
      nextPeriod: nextDayClasses[0],
    };
  }

  // 1. Check if class is currently happening ("ACUM")
  for (const period of todaysClasses) {
    const startMins = timeToMinutes(period.startTime);
    const endMins = timeToMinutes(period.endTime);

    if (currentMinutes >= startMins && currentMinutes < endMins) {
      return {
        status: "now",
        currentPeriod: period,
        endsAt: period.endTime,
        todaysPeriods: todaysClasses,
      };
    }
  }

  // 2. Check if an upcoming class exists today ("URMEAZĂ")
  for (const period of todaysClasses) {
    const startMins = timeToMinutes(period.startTime);
    if (currentMinutes < startMins) {
      const minutesUntilNext = startMins - currentMinutes;
      return {
        status: "upcoming",
        nextPeriod: period,
        minutesUntilNext,
        todaysPeriods: todaysClasses,
      };
    }
  }

  // 3. All classes today have completed ("ended_today")
  const nextDay = getNextSchoolDay(currentDayIndex);
  const nextDayClasses = getDayClasses(schedule, nextDay);
  return {
    status: "ended_today",
    nextDayName: nextDay,
    todaysPeriods: todaysClasses,
    nextPeriod: nextDayClasses[0],
  };
}
