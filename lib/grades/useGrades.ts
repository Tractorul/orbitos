"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { GradeEntry, SubjectGradesSummary } from "@/types/grades";
import {
  getStoredGrades,
  addGrade as storeAddGrade,
  deleteGrade as storeDeleteGrade,
  calculateSubjectAverage,
  calculateGeneralAverage,
  subscribeToGrades,
  DEFAULT_SCHOOL_SUBJECTS,
} from "./gradeStore";
import { getStoredSchoolSchedule } from "@/lib/school/schoolStore";

export function useGrades() {
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    const loadedGrades = getStoredGrades();
    setGrades(loadedGrades);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribeToGrades(refresh);
    return () => unsubscribe();
  }, [refresh]);

  const addGrade = useCallback((grade: Omit<GradeEntry, "id" | "createdAt">) => {
    return storeAddGrade(grade);
  }, []);

  const deleteGrade = useCallback((id: string) => {
    storeDeleteGrade(id);
  }, []);

  // Compute list of all unique subjects from both schedule and grades
  const allSubjects = useMemo(() => {
    const schedule = getStoredSchoolSchedule();
    const scheduleSubjects = schedule.map((p) => p.subject.trim());
    const gradeSubjects = grades.map((g) => g.subject.trim());
    const combined = Array.from(
      new Set([...scheduleSubjects, ...gradeSubjects, ...DEFAULT_SCHOOL_SUBJECTS])
    ).filter(Boolean);
    return combined;
  }, [grades]);

  // Compute summary per subject
  const subjectSummaries = useMemo<SubjectGradesSummary[]>(() => {
    return allSubjects.map((subject) => {
      const subjectGrades = grades
        .filter((g) => g.subject.toLowerCase() === subject.toLowerCase())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const avg = calculateSubjectAverage(subjectGrades);
      return {
        subject,
        grades: subjectGrades,
        average: avg,
      };
    });
  }, [allSubjects, grades]);

  // Compute overall general average
  const generalAverage = useMemo(() => {
    return calculateGeneralAverage(subjectSummaries);
  }, [subjectSummaries]);

  return {
    grades,
    isLoaded,
    allSubjects,
    subjectSummaries,
    generalAverage,
    addGrade,
    deleteGrade,
    refresh,
  };
}
