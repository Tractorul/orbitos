"use client";

import { useState, useEffect } from "react";
import {
  DayOfWeek,
  SchoolPeriod,
  SchoolProfile,
} from "@/types/school";
import {
  DEFAULT_SCHOOL_PROFILE,
} from "@/lib/school/defaultData";
import {
  getStoredSchoolProfile,
  getStoredSchoolSchedule,
  saveStoredSchoolProfile,
  saveStoredSchoolSchedule,
  resetStoredSchoolSchedule,
  lookupTeacher,
} from "@/lib/school/schoolStore";
import { getDayClasses, SCHOOL_DAYS } from "@/lib/school/scheduleLogic";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ActionSheet } from "@/components/ui/ActionSheet";
import {
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  User,
  GraduationCap,
  Check,
  Award,
} from "lucide-react";
import { GradeTrackerModal } from "@/components/school/GradeTrackerModal";
import { t } from "@/lib/i18n";

export function SchoolScheduleManager() {
  const [schedule, setSchedule] = useState<SchoolPeriod[]>([]);
  const [profile, setProfile] = useState<SchoolProfile>(DEFAULT_SCHOOL_PROFILE);
  const [activeDay, setActiveDay] = useState<DayOfWeek>("Luni");

  // Period modal state
  const [periodModalOpen, setPeriodModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<SchoolPeriod | null>(null);
  const [formSubject, setFormSubject] = useState("");
  const [formTeacher, setFormTeacher] = useState("");
  const [formStartTime, setFormStartTime] = useState("12:30");
  const [formEndTime, setFormEndTime] = useState("13:20");
  const [formDay, setFormDay] = useState<DayOfWeek>("Luni");

  // Profile modal state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [profileClass, setProfileClass] = useState("");
  const [profileShift, setProfileShift] = useState("");
  const [profileYear, setProfileYear] = useState("");
  const [profileHomeroom, setProfileHomeroom] = useState("");

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loadedSchedule = getStoredSchoolSchedule();
    const loadedProfile = getStoredSchoolProfile();
    setSchedule(loadedSchedule);
    setProfile(loadedProfile);
  }, []);

  const openAddPeriod = () => {
    setEditingPeriod(null);
    setFormSubject("");
    setFormTeacher("");
    setFormStartTime("12:30");
    setFormEndTime("13:20");
    setFormDay(activeDay);
    setPeriodModalOpen(true);
  };

  const openEditPeriod = (period: SchoolPeriod) => {
    setEditingPeriod(period);
    setFormSubject(period.subject);
    setFormTeacher(period.teacher);
    setFormStartTime(period.startTime);
    setFormEndTime(period.endTime);
    setFormDay(period.day);
    setPeriodModalOpen(true);
  };

  const handleSubjectChange = (subject: string) => {
    setFormSubject(subject);
    const autoTeacher = lookupTeacher(subject);
    if (autoTeacher && !formTeacher) {
      setFormTeacher(autoTeacher);
    }
  };

  const handleSavePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formStartTime || !formEndTime) return;

    let updated: SchoolPeriod[];
    if (editingPeriod) {
      updated = schedule.map((p) =>
        p.id === editingPeriod.id
          ? {
              ...p,
              subject: formSubject.trim(),
              teacher: formTeacher.trim() || lookupTeacher(formSubject) || "Profesor",
              startTime: formStartTime,
              endTime: formEndTime,
              day: formDay,
            }
          : p
      );
    } else {
      const newPeriod: SchoolPeriod = {
        id: `period-${Date.now()}`,
        day: formDay,
        subject: formSubject.trim(),
        teacher: formTeacher.trim() || lookupTeacher(formSubject) || "Profesor",
        startTime: formStartTime,
        endTime: formEndTime,
      };
      updated = [...schedule, newPeriod];
    }

    setSchedule(updated);
    saveStoredSchoolSchedule(updated);
    setPeriodModalOpen(false);
    triggerSaved();
  };

  const handleDeletePeriod = (id: string) => {
    const updated = schedule.filter((p) => p.id !== id);
    setSchedule(updated);
    saveStoredSchoolSchedule(updated);
    triggerSaved();
  };

  const openEditProfile = () => {
    setProfileClass(profile.className);
    setProfileShift(profile.shift);
    setProfileYear(profile.schoolYear);
    setProfileHomeroom(profile.homeroomTeacher);
    setProfileModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SchoolProfile = {
      className: profileClass.trim() || "8G",
      shift: profileShift.trim() || "Schimbul II",
      schoolYear: profileYear.trim() || "2026–2027",
      homeroomTeacher: profileHomeroom.trim() || "Bicosu Ilona",
    };
    setProfile(updated);
    saveStoredSchoolProfile(updated);
    setProfileModalOpen(false);
    triggerSaved();
  };

  const handleResetToDefault = () => {
    if (confirm("Sigur dorești să resetezi orarul la configurația inițială a clasei 8G?")) {
      const reset = resetStoredSchoolSchedule();
      setSchedule(reset);
      setProfile(DEFAULT_SCHOOL_PROFILE);
      triggerSaved();
    }
  };

  const triggerSaved = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const currentDayPeriods = getDayClasses(schedule, activeDay);

  return (
    <div className="space-y-3.5">
      {/* Profile Header Summary */}
      <GlassCard className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-nord-9/20 to-nord-10/20 text-nord-9 border border-nord-9/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(129,161,193,0.2)]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-nord-6 truncate">
                  Clasa {profile.className}
                </h3>
                <Badge variant="cyan" size="sm" dot>
                  {profile.shift}
                </Badge>
              </div>
              <p className="text-xs text-nord-4/70 mt-0.5 truncate">
                Diriginte: <span className="text-nord-5 font-semibold">{profile.homeroomTeacher}</span> • {profile.schoolYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setGradeModalOpen(true)}
              className="text-nord-8 hover:text-nord-7 text-xs"
            >
              <Award className="w-3.5 h-3.5 mr-1" />
              <span>Catalog Note</span>
            </Button>

            <Button
              variant="glass"
              size="sm"
              onClick={openEditProfile}
              className="text-nord-9 hover:text-nord-8 text-xs"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" />
              <span>Modifică</span>
            </Button>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-3 p-2.5 rounded-2xl bg-nord-14/15 border border-nord-14/30 text-nord-14 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>Orarul a fost actualizat cu succes!</span>
          </div>
        )}
      </GlassCard>

      {/* Weekday Selector Tabs */}
      <div className="flex gap-1.5 p-1.5 rounded-[22px] bg-[#0E1524]/80 border border-white/[0.08] backdrop-blur-xl overflow-x-auto shadow-inner">
        {SCHOOL_DAYS.map((day) => {
          const isSelected = activeDay === day;
          const count = schedule.filter((p) => p.day === day).length;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-1 min-w-[65px] py-2 px-2 text-xs font-medium rounded-2xl transition-all duration-200 flex flex-col items-center gap-0.5 select-none ${
                isSelected
                  ? "bg-nord-8 text-[#070A0F] font-bold shadow-[0_4px_16px_rgba(136,192,208,0.4)]"
                  : "text-nord-4/70 hover:text-nord-6 hover:bg-white/[0.04]"
              }`}
            >
              <span>{day}</span>
              <span className={`text-[10px] font-mono ${isSelected ? "text-[#070A0F]/80" : "text-nord-4/40"}`}>
                {count} ore
              </span>
            </button>
          );
        })}
      </div>

      {/* Day Timetable Timeline List */}
      <GlassCard className="p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-bold text-nord-6">{activeDay}</h3>
            <p className="text-xs text-nord-4/60">
              {currentDayPeriods.length} ore programate în {profile.shift}
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={openAddPeriod}
            className="rounded-full px-3.5 h-8 text-xs font-semibold shadow-[0_0_15px_rgba(136,192,208,0.35)]"
          >
            <Plus className="w-3.5 h-3.5 mr-1 stroke-[2.8]" />
            <span>{t.school.addPeriod}</span>
          </Button>
        </div>

        {currentDayPeriods.length === 0 ? (
          <div className="text-center py-8 text-nord-4/50 text-xs">
            <p className="font-semibold text-nord-5">Nicio oră programată pentru {activeDay}.</p>
            <p className="mt-1">Apasă pe &quot;Adaugă o oră&quot; pentru a introduce o materie.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentDayPeriods.map((period, idx) => (
              <div
                key={period.id}
                className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-nord-8/30 transition-all duration-150 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-xl bg-white/[0.06] border border-white/[0.08] text-xs font-mono font-bold text-nord-4 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-nord-6 truncate">
                        {period.subject}
                      </span>
                    </div>
                    <p className="text-xs text-nord-4/60 flex items-center gap-1.5 mt-0.5 truncate">
                      <User className="w-3 h-3 text-nord-8 shrink-0" />
                      <span className="truncate">{period.teacher}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-nord-8 font-semibold bg-nord-8/10 border border-nord-8/20 px-2.5 py-1 rounded-xl">
                    {period.startTime} – {period.endTime}
                  </span>

                  <button
                    onClick={() => openEditPeriod(period)}
                    aria-label="Editează ora"
                    className="w-7 h-7 rounded-lg text-nord-4/50 hover:text-nord-8 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeletePeriod(period.id)}
                    aria-label="Șterge ora"
                    className="w-7 h-7 rounded-lg text-nord-4/50 hover:text-nord-11 hover:bg-nord-11/15 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Reset to Default Action */}
      <div className="flex justify-end pt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetToDefault}
          className="text-xs text-nord-4/60 hover:text-nord-13"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          <span>{t.school.resetToDefault}</span>
        </Button>
      </div>

      {/* Add / Edit Period Action Sheet */}
      <ActionSheet
        isOpen={periodModalOpen}
        onClose={() => setPeriodModalOpen(false)}
        title={editingPeriod ? t.school.editPeriod : t.school.addPeriod}
        description={`Ziua: ${formDay}`}
      >
        <form onSubmit={handleSavePeriod} className="space-y-4 pt-1">
          {/* Day selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Ziua din săptămână
            </label>
            <select
              value={formDay}
              onChange={(e) => setFormDay(e.target.value as DayOfWeek)}
              className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-nord-6 focus:outline-none"
            >
              {SCHOOL_DAYS.map((d) => (
                <option key={d} value={d} className="bg-[#0E1524] text-nord-6">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Subject with Quick Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Materia
            </label>
            <input
              type="text"
              required
              value={formSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              placeholder="Ex: Mate, Română, Fizică"
              className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none"
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {["Mate", "Română", "Engleză", "Franceză", "Fizică", "Chimie", "Biologie", "Istorie", "Geografie", "TIC", "Sport"].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => handleSubjectChange(s)}
                  className="text-[11px] bg-white/[0.05] hover:bg-nord-8/20 hover:text-nord-8 border border-white/10 px-2.5 py-1 rounded-xl text-nord-4/90 transition-all font-medium active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Teacher */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Profesor
            </label>
            <input
              type="text"
              value={formTeacher}
              onChange={(e) => setFormTeacher(e.target.value)}
              placeholder="Numele cadrului didactic"
              className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none"
            />
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
                Ora de început
              </label>
              <input
                type="time"
                required
                value={formStartTime}
                onChange={(e) => setFormStartTime(e.target.value)}
                className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-nord-6 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
                Ora de sfârșit
              </label>
              <input
                type="time"
                required
                value={formEndTime}
                onChange={(e) => setFormEndTime(e.target.value)}
                className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-nord-6 focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setPeriodModalOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {t.common.save}
            </Button>
          </div>
        </form>
      </ActionSheet>

      {/* Edit School Profile Action Sheet */}
      <ActionSheet
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Modificare profil școlar"
        description="Configurează clasa, schimbul și dirigintele"
      >
        <form onSubmit={handleSaveProfile} className="space-y-3.5 pt-1">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Clasa
            </label>
            <input
              type="text"
              required
              value={profileClass}
              onChange={(e) => setProfileClass(e.target.value)}
              placeholder="8G"
              className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-nord-6 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Schimbul
            </label>
            <input
              type="text"
              required
              value={profileShift}
              onChange={(e) => setProfileShift(e.target.value)}
              placeholder="Schimbul II"
              className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-nord-6 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Diriginte
            </label>
            <input
              type="text"
              required
              value={profileHomeroom}
              onChange={(e) => setProfileHomeroom(e.target.value)}
              placeholder="Bicosu Ilona"
              className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-nord-6 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              An școlar
            </label>
            <input
              type="text"
              required
              value={profileYear}
              onChange={(e) => setProfileYear(e.target.value)}
              placeholder="2026–2027"
              className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-nord-6 focus:outline-none"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setProfileModalOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {t.common.save}
            </Button>
          </div>
        </form>
      </ActionSheet>

      {/* Grade Tracker Modal */}
      <GradeTrackerModal
        isOpen={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
      />
    </div>
  );
}
