"use client";

import { useState } from "react";
import { SchoolPeriod, SchoolProfile } from "@/types/school";
import { ActionSheet } from "@/components/ui/ActionSheet";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { User, Clock, Award } from "lucide-react";
import { GradeTrackerModal } from "@/components/school/GradeTrackerModal";
import { useGrades } from "@/lib/grades/useGrades";
import { t } from "@/lib/i18n";

interface ClassDetailModalProps {
  period: SchoolPeriod | null;
  profile: SchoolProfile;
  isOpen: boolean;
  onClose: () => void;
  statusBadge?: string;
}

export function ClassDetailModal({
  period,
  profile,
  isOpen,
  onClose,
  statusBadge,
}: ClassDetailModalProps) {
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const { subjectSummaries } = useGrades();

  if (!period) return null;

  const subjectSummary = subjectSummaries.find(
    (s) => s.subject.toLowerCase() === period.subject.toLowerCase()
  );

  return (
    <>
      <ActionSheet
        isOpen={isOpen}
        onClose={onClose}
        title={period.fullSubject || period.subject}
        description={`${period.day} • ${period.startTime} – ${period.endTime}`}
      >
        <div className="space-y-3 pt-1 pb-1">
          {/* Status Badge if active or upcoming */}
          {statusBadge && (
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="md" dot>
                {statusBadge}
              </Badge>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-2.5">
            {/* Subject Grade Summary Quick Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-nord-8/10 to-nord-9/10 border border-nord-8/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-nord-8/20 text-nord-8 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-nord-4/60 font-semibold uppercase tracking-wider">
                    Situație școlară
                  </p>
                  <p className="text-xs font-bold text-nord-6">
                    {subjectSummary?.grades.length || 0} note înregistrate
                    {subjectSummary?.average !== null ? ` • Medie: ${subjectSummary?.average?.toFixed(2)}` : ""}
                  </p>
                </div>
              </div>

              <Button
                variant="glass"
                size="sm"
                onClick={() => setIsGradeModalOpen(true)}
                className="text-xs font-semibold text-nord-8 h-8 px-3"
              >
                Catalog
              </Button>
            </div>

            {/* Profesor */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-nord-8/15 text-nord-8 border border-nord-8/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(136,192,208,0.2)]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-nord-4/60 font-semibold uppercase tracking-wider">
                  {t.school.teacher}
                </p>
                <p className="text-sm font-bold text-nord-6">{period.teacher}</p>
              </div>
            </div>

            {/* Interval Orar */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center gap-3.5 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-nord-9/15 text-nord-9 border border-nord-9/30 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(129,161,193,0.2)]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-nord-4/60 font-semibold uppercase tracking-wider">
                  {t.school.time}
                </p>
                <p className="text-sm font-bold font-mono text-nord-6">
                  {period.startTime} – {period.endTime}
                </p>
              </div>
            </div>

            {/* Clasa & Schimbul */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] shadow-sm">
                <p className="text-[10px] text-nord-4/60 font-semibold uppercase tracking-wider">
                  {t.school.className}
                </p>
                <p className="text-sm font-bold text-nord-6 mt-0.5">{profile.className}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] shadow-sm">
                <p className="text-[10px] text-nord-4/60 font-semibold uppercase tracking-wider">
                  {t.school.shift}
                </p>
                <p className="text-sm font-bold text-nord-6 mt-0.5">{profile.shift}</p>
              </div>
            </div>

            {/* Diriginte & An Școlar */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[10px] text-nord-4/60 font-semibold uppercase tracking-wider">
                  {t.school.homeroomTeacher}
                </p>
                <p className="text-xs font-bold text-nord-6 mt-0.5">
                  {profile.homeroomTeacher}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-nord-4/60 font-semibold uppercase tracking-wider">
                  {t.school.schoolYear}
                </p>
                <p className="text-xs font-bold font-mono text-nord-6 mt-0.5">
                  {profile.schoolYear}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ActionSheet>

      {/* Grade Tracker Modal */}
      <GradeTrackerModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        defaultSubject={period.subject}
      />
    </>
  );
}
