"use client";

import { useState } from "react";
import { ActionSheet } from "@/components/ui/ActionSheet";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useGrades } from "@/lib/grades/useGrades";
import { GradeEntry, GradeType } from "@/types/grades";
import { getTodayDateString, formatRomanianShortDate } from "@/lib/utils/dateUtils";
import {
  Award,
  Plus,
  Trash2,
  BookOpen,
  Calendar,
  Sparkles,
} from "lucide-react";
import { t } from "@/lib/i18n";

interface GradeTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export function GradeTrackerModal({
  isOpen,
  onClose,
  defaultSubject,
}: GradeTrackerModalProps) {
  const {
    allSubjects,
    subjectSummaries,
    generalAverage,
    addGrade,
    deleteGrade,
  } = useGrades();

  // Add grade form state
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(defaultSubject || "Matematică");
  const [gradeValue, setGradeValue] = useState<number>(10);
  const [gradeDate, setGradeDate] = useState(getTodayDateString());
  const [gradeType, setGradeType] = useState<GradeType>("oral");
  const [gradeNotes, setGradeNotes] = useState("");

  // Grade inspect popup
  const [inspectGrade, setInspectGrade] = useState<GradeEntry | null>(null);

  const handleOpenAddForSubject = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setGradeValue(10);
    setGradeDate(getTodayDateString());
    setGradeType("oral");
    setGradeNotes("");
    setIsAddingGrade(true);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    addGrade({
      subject: selectedSubject,
      value: gradeValue,
      date: gradeDate,
      type: gradeType,
      notes: gradeNotes.trim() || undefined,
    });
    setIsAddingGrade(false);
  };

  const handleDeleteInspectGrade = () => {
    if (inspectGrade) {
      deleteGrade(inspectGrade.id);
      setInspectGrade(null);
    }
  };

  const gradeTypes: { type: GradeType; label: string }[] = [
    { type: "oral", label: "Ascultare orală" },
    { type: "test", label: "Test / Lucrare" },
    { type: "teza", label: "Teză semestrială" },
    { type: "proiect", label: "Proiect / Referat" },
  ];

  const getGradePillColor = (val: number) => {
    if (val === 10) return "bg-nord-8/20 border-nord-8/40 text-nord-8 font-extrabold shadow-[0_0_10px_rgba(136,192,208,0.25)]";
    if (val >= 8) return "bg-nord-14/20 border-nord-14/40 text-nord-14 font-bold";
    if (val >= 5) return "bg-nord-13/20 border-nord-13/40 text-nord-13 font-bold";
    return "bg-nord-11/20 border-nord-11/40 text-nord-11 font-bold";
  };

  return (
    <>
      <ActionSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Catalog Note & Medii"
        description="Evidența notelor și a mediilor pe materii"
      >
        <div className="space-y-4 pt-1 pb-2">
          {/* General Average Hero Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-nord-8/15 via-nord-9/10 to-nord-10/10 border border-nord-8/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-nord-8/20 border border-nord-8/40 text-nord-8 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(136,192,208,0.3)]">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-nord-8/90 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Medie Generală Estimată
                </span>
                <p className="text-xs text-nord-4/60 mt-0.5">
                  Calculată automat din mediile tuturor materiilor
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-2xl sm:text-3xl font-mono font-black text-nord-6 drop-shadow-[0_0_12px_rgba(136,192,208,0.5)]">
                {generalAverage !== null ? generalAverage.toFixed(2) : "—"}
              </span>
            </div>
          </div>

          {/* Quick Action to Add Grade */}
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-nord-4/70">
              Materii &amp; Note
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenAddForSubject(defaultSubject || allSubjects[0] || "Matematică")}
              className="rounded-full px-3 h-7 text-xs font-semibold shadow-[0_0_12px_rgba(136,192,208,0.3)]"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Adaugă notă</span>
            </Button>
          </div>

          {/* Subjects List */}
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {subjectSummaries.map((summary) => (
              <div
                key={summary.subject}
                className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="w-4 h-4 text-nord-9 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-nord-6 truncate">
                      {summary.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono text-nord-4/60">
                      Medie:
                    </span>
                    <Badge
                      variant={
                        summary.average !== null
                          ? summary.average >= 9.5
                            ? "cyan"
                            : summary.average >= 8
                            ? "green"
                            : "default"
                          : "outline"
                      }
                      size="sm"
                      className="font-mono font-bold px-2 py-0.5"
                    >
                      {summary.average !== null ? summary.average.toFixed(2) : "—"}
                    </Badge>

                    <button
                      type="button"
                      onClick={() => handleOpenAddForSubject(summary.subject)}
                      title={`Adaugă notă la ${summary.subject}`}
                      className="w-7 h-7 rounded-xl bg-white/[0.05] hover:bg-nord-8/20 text-nord-4/60 hover:text-nord-8 border border-white/[0.08] flex items-center justify-center transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Grade Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {summary.grades.length === 0 ? (
                    <span className="text-[11px] text-nord-4/40 italic">
                      Nicio notă înregistrată încă
                    </span>
                  ) : (
                    summary.grades.map((grade) => (
                      <button
                        key={grade.id}
                        type="button"
                        onClick={() => setInspectGrade(grade)}
                        className={`w-7 h-7 rounded-xl border text-xs font-mono flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${getGradePillColor(
                          grade.value
                        )}`}
                        title={`${grade.value} • ${grade.type} (${formatRomanianShortDate(grade.date)})`}
                      >
                        {grade.value}
                      </button>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ActionSheet>

      {/* Add Grade Sub-Modal ActionSheet */}
      <ActionSheet
        isOpen={isAddingGrade}
        onClose={() => setIsAddingGrade(false)}
        title="Adăugare Notă"
        description={`Înregistrează o notă nouă pentru ${selectedSubject}`}
      >
        <form onSubmit={handleSaveGrade} className="space-y-4 pt-1 pb-1">
          {/* Subject Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Materia
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-nord-6 focus:outline-none"
            >
              {allSubjects.map((s) => (
                <option key={s} value={s} className="bg-[#0E1524] text-nord-6">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Grade Value Selector Buttons (1 - 10) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Nota obținută: <span className="text-nord-8 font-mono font-bold text-base ml-1">{gradeValue}</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => {
                const isSelected = gradeValue === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGradeValue(num)}
                    className={`py-2 text-xs sm:text-sm font-mono font-bold rounded-xl border transition-all ${
                      isSelected
                        ? "bg-nord-8 text-[#070A0F] border-nord-8 shadow-[0_0_12px_rgba(136,192,208,0.4)] scale-105"
                        : "bg-white/[0.04] text-nord-4/80 border-white/[0.06] hover:bg-white/[0.08]"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grade Type Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Tipul evaluării
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {gradeTypes.map((gt) => {
                const isSelected = gradeType === gt.type;
                return (
                  <button
                    key={gt.type}
                    type="button"
                    onClick={() => setGradeType(gt.type)}
                    className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? "bg-nord-8/20 border-nord-8 text-nord-8 font-semibold shadow-[0_0_10px_rgba(136,192,208,0.2)]"
                        : "bg-white/[0.03] border-white/[0.06] text-nord-4/60 hover:text-nord-6"
                    }`}
                  >
                    {gt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Data acordării
            </label>
            <input
              type="date"
              required
              value={gradeDate}
              onChange={(e) => setGradeDate(e.target.value)}
              className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs text-nord-6 focus:outline-none"
            />
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Observații (Opțional)
            </label>
            <input
              type="text"
              value={gradeNotes}
              onChange={(e) => setGradeNotes(e.target.value)}
              placeholder="Observații despre evaluare..."
              className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs text-nord-6 placeholder:text-nord-4/40 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setIsAddingGrade(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" variant="primary" className="flex-1 font-bold">
              Salvează nota
            </Button>
          </div>
        </form>
      </ActionSheet>

      {/* Inspect / Delete Grade Modal */}
      <ActionSheet
        isOpen={!!inspectGrade}
        onClose={() => setInspectGrade(null)}
        title="Detalii Notă"
        description={inspectGrade ? `${inspectGrade.subject} • Nota ${inspectGrade.value}` : ""}
      >
        {inspectGrade && (
          <div className="space-y-4 pt-1 pb-1">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-nord-4/60">Materie</span>
                <span className="text-xs font-bold text-nord-6">{inspectGrade.subject}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-nord-4/60">Nota</span>
                <span className="text-base font-mono font-extrabold text-nord-8">{inspectGrade.value}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-nord-4/60">Tip evaluare</span>
                <span className="text-xs font-medium text-nord-6">
                  {inspectGrade.type === "oral"
                    ? "Ascultare orală"
                    : inspectGrade.type === "test"
                    ? "Test / Lucrare"
                    : inspectGrade.type === "teza"
                    ? "Teză"
                    : "Proiect"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-nord-4/60">Data</span>
                <span className="text-xs font-mono text-nord-4/80 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-nord-9" />
                  {formatRomanianShortDate(inspectGrade.date)}
                </span>
              </div>
              {inspectGrade.notes && (
                <div className="pt-2 border-t border-white/[0.06]">
                  <p className="text-[11px] text-nord-4/50">Observații:</p>
                  <p className="text-xs text-nord-6 mt-0.5">{inspectGrade.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2.5 pt-1">
              <Button
                type="button"
                variant="secondary"
                onClick={handleDeleteInspectGrade}
                className="text-nord-11 hover:bg-nord-11/15 flex items-center justify-center gap-1.5 px-4"
              >
                <Trash2 className="w-4 h-4" />
                <span>Șterge nota</span>
              </Button>
              <Button
                type="button"
                variant="primary"
                className="flex-1"
                onClick={() => setInspectGrade(null)}
              >
                Închide
              </Button>
            </div>
          </div>
        )}
      </ActionSheet>
    </>
  );
}
