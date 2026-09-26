"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  GraduationCap,
  ChevronRight,
  Award,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { SchoolPeriod, SchoolProfile } from "@/types/school";
import {
  getCurrentOrNextClass,
  formatMinutesCountdown,
  timeToMinutes,
} from "@/lib/school/scheduleLogic";
import {
  getStoredSchoolProfile,
  getStoredSchoolSchedule,
} from "@/lib/school/schoolStore";
import { ClassDetailModal } from "@/components/school/ClassDetailModal";
import { GradeTrackerModal } from "@/components/school/GradeTrackerModal";
import { useGrades } from "@/lib/grades/useGrades";
import { t } from "@/lib/i18n";

export function SchoolCard() {
  const [schedule, setSchedule] = useState<SchoolPeriod[]>([]);
  const [profile, setProfile] = useState<SchoolProfile>(getStoredSchoolProfile());
  const [selectedPeriod, setSelectedPeriod] = useState<SchoolPeriod | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const { generalAverage } = useGrades();

  useEffect(() => {
    setSchedule(getStoredSchoolSchedule());
    setProfile(getStoredSchoolProfile());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000 * 30); // recalculate every 30s

    return () => clearInterval(timer);
  }, []);

  const status = getCurrentOrNextClass(schedule, currentTime);

  const handlePeriodClick = (period: SchoolPeriod) => {
    setSelectedPeriod(period);
    setDetailModalOpen(true);
  };

  // Calculate live progress percentage if a class is active ("ACUM")
  let classProgressPercent = 0;
  let minutesRemainingInClass = 0;
  if (status.status === "now" && status.currentPeriod) {
    const startMins = timeToMinutes(status.currentPeriod.startTime);
    const endMins = timeToMinutes(status.currentPeriod.endTime);
    const nowMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    const duration = endMins - startMins;
    const elapsed = Math.max(0, nowMins - startMins);
    classProgressPercent = Math.min(100, Math.max(0, Math.round((elapsed / duration) * 100)));
    minutesRemainingInClass = Math.max(0, endMins - nowMins);
  }

  return (
    <>
      <div className="space-y-2.5">
        {/* Section Label */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-nord-8/80">
            <GraduationCap className="w-3.5 h-3.5 text-nord-8" />
            <span>{t.school.title} • {profile.className}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setGradeModalOpen(true)}
              className="text-xs text-nord-8 hover:text-nord-7 font-semibold flex items-center gap-1 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Catalog</span>
              {generalAverage !== null && (
                <span className="font-mono bg-nord-8/20 border border-nord-8/40 px-1.5 py-0.2 rounded-md text-[10px] text-nord-8">
                  {generalAverage.toFixed(2)}
                </span>
              )}
            </button>

            <Link
              href="/more#school"
              className="text-xs text-nord-4/60 hover:text-nord-8 flex items-center gap-0.5 font-medium transition-colors group"
            >
              <span>{t.school.manage}</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* 1. ACUM / URMEAZĂ Featured Card */}
        {status.status === "now" && status.currentPeriod && (
          <GlassCard
            variant="accent"
            glow
            onClick={() => handlePeriodClick(status.currentPeriod!)}
            className="p-4 sm:p-5 cursor-pointer hover:border-nord-8/50 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="cyan" size="sm" dot className="font-bold tracking-wider">
                    ACUM
                  </Badge>
                  <span className="text-xs text-nord-8/90 font-medium font-mono">
                    {t.school.endsAt} {status.endsAt}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-nord-6 group-hover:text-nord-8 transition-colors truncate">
                  {status.currentPeriod.subject}
                </h3>

                <p className="text-xs text-nord-4/80 flex items-center gap-1.5 pt-0.5">
                  <User className="w-3 h-3 text-nord-8 shrink-0" />
                  <span className="truncate">{status.currentPeriod.teacher}</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="px-2.5 py-1 rounded-xl bg-white/[0.08] border border-white/10 text-xs font-mono font-semibold text-nord-6 shadow-inner">
                  {status.currentPeriod.startTime} – {status.currentPeriod.endTime}
                </div>
              </div>
            </div>

            {/* Real-Time Class Progress Bar */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5">
              <div className="flex justify-between text-[11px] text-nord-4/70 font-medium">
                <span>Progres oră ({classProgressPercent}%)</span>
                <span className="text-nord-8 font-mono">
                  {minutesRemainingInClass > 0 ? `${minutesRemainingInClass} min rămase` : "Se încheie acum"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden border border-white/[0.06]">
                <div
                  className="h-full bg-gradient-to-r from-nord-8 to-nord-7 rounded-full transition-all duration-500 shadow-[0_0_10px_#88C0D0]"
                  style={{ width: `${classProgressPercent}%` }}
                />
              </div>
            </div>
          </GlassCard>
        )}

        {status.status === "upcoming" && status.nextPeriod && (
          <GlassCard
            variant="accent"
            onClick={() => handlePeriodClick(status.nextPeriod!)}
            className="p-4 sm:p-5 cursor-pointer hover:border-nord-8/40 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="blue" size="sm" dot className="font-bold tracking-wider">
                    URMEAZĂ
                  </Badge>
                  <span className="text-xs text-nord-9 font-medium">
                    {formatMinutesCountdown(status.minutesUntilNext || 0)}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-nord-6 group-hover:text-nord-8 transition-colors truncate">
                  {status.nextPeriod.subject}
                </h3>

                <p className="text-xs text-nord-4/80 flex items-center gap-1.5 pt-0.5">
                  <User className="w-3 h-3 text-nord-9 shrink-0" />
                  <span className="truncate">{status.nextPeriod.teacher}</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="px-2.5 py-1 rounded-xl bg-white/[0.08] border border-white/10 text-xs font-mono font-semibold text-nord-6 shadow-inner">
                  {status.nextPeriod.startTime} – {status.nextPeriod.endTime}
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {status.status === "ended_today" && (
          <GlassCard className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-nord-6">{t.school.classesEndedToday}</p>
              <p className="text-xs text-nord-4/60">
                Următoarea zi de cursuri: <span className="text-nord-8 font-medium">{status.nextDayName}</span>
              </p>
            </div>
            {status.nextPeriod && (
              <Badge variant="outline" size="sm" className="font-mono">
                {status.nextPeriod.subject} ({status.nextPeriod.startTime})
              </Badge>
            )}
          </GlassCard>
        )}

        {status.status === "weekend" && (
          <GlassCard className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-nord-6">{t.school.weekendNotice}</p>
              <p className="text-xs text-nord-4/60">
                Luni la {status.nextPeriod?.startTime || "12:30"}: <span className="text-nord-8 font-medium">{status.nextPeriod?.subject || "Engleză"}</span>
              </p>
            </div>
          </GlassCard>
        )}

        {/* 2. Today's Full List of Classes (Timeline List) */}
        {status.todaysPeriods.length > 0 && (
          <GlassCard className="p-3.5 sm:p-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[11px] text-nord-4/60 font-semibold uppercase tracking-wider">
                <span>Toate orele de azi ({status.todaysPeriods.length})</span>
                <span className="font-mono text-nord-4/50">{profile.shift}</span>
              </div>

              <div className="space-y-1.5 pt-1 max-h-56 overflow-y-auto pr-0.5">
                {status.todaysPeriods.map((period, idx) => {
                  const isCurrent =
                    status.status === "now" &&
                    status.currentPeriod?.id === period.id;
                  const isNext =
                    status.status === "upcoming" &&
                    status.nextPeriod?.id === period.id;

                  return (
                    <div
                      key={period.id}
                      onClick={() => handlePeriodClick(period)}
                      className={`p-2.5 rounded-2xl border transition-all duration-150 flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? "bg-nord-8/15 border-nord-8/40 shadow-[0_0_15px_rgba(136,192,208,0.15)] ring-1 ring-nord-8/20"
                          : isNext
                          ? "bg-nord-9/10 border-nord-9/30 hover:border-nord-8/30"
                          : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[11px] font-mono font-medium text-nord-4/70 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-nord-6 truncate">
                              {period.subject}
                            </span>
                            {isCurrent && (
                              <Badge variant="cyan" size="sm" dot>
                                Acum
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-nord-4/60 truncate">
                            {period.teacher}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-mono text-nord-4/80 bg-white/[0.04] px-2 py-0.5 rounded-lg border border-white/[0.06]">
                          {period.startTime} – {period.endTime}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Class Details Modal Sheet */}
      <ClassDetailModal
        period={selectedPeriod}
        profile={profile}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        statusBadge={
          status.status === "now" && selectedPeriod?.id === status.currentPeriod?.id
            ? "ACUM"
            : status.status === "upcoming" && selectedPeriod?.id === status.nextPeriod?.id
            ? "URMEAZĂ"
            : undefined
        }
      />

      {/* Grade Tracker Modal */}
      <GradeTrackerModal
        isOpen={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
      />
    </>
  );
}
