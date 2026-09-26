"use client";

import { useState, useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Download, Upload, RotateCcw, Check, AlertCircle } from "lucide-react";
import { getStoredSchoolProfile, getStoredSchoolSchedule, saveStoredSchoolProfile, saveStoredSchoolSchedule } from "@/lib/school/schoolStore";
import { getStoredTasks, saveStoredTasks } from "@/lib/tasks/taskStore";
import { getStoredCalendarEvents, saveStoredCalendarEvents } from "@/lib/calendar/calendarStore";
import { getStoredNotes, saveStoredNotes } from "@/lib/notes/noteStore";
import { getStoredGrades, saveStoredGrades } from "@/lib/grades/gradeStore";
import { getStoredTempUnit, setStoredTempUnit } from "@/lib/weather/weatherStore";
import { getTodayDateString } from "@/lib/utils/dateUtils";

export function DataBackupManager() {
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleExport = () => {
    try {
      const backupData = {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        schoolProfile: getStoredSchoolProfile(),
        schoolSchedule: getStoredSchoolSchedule(),
        tasks: getStoredTasks(),
        calendarEvents: getStoredCalendarEvents(),
        notes: getStoredNotes(),
        grades: getStoredGrades(),
        temperatureUnit: getStoredTempUnit(),
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `orbit-backup-${getTodayDateString()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showStatus("success", "Copie de siguranță (JSON) descărcată cu succes!");
    } catch (err) {
      console.error(err);
      showStatus("error", "Eroare la exportarea datelor.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.schoolProfile) saveStoredSchoolProfile(parsed.schoolProfile);
        if (parsed.schoolSchedule) saveStoredSchoolSchedule(parsed.schoolSchedule);
        if (parsed.tasks) saveStoredTasks(parsed.tasks);
        if (parsed.calendarEvents) saveStoredCalendarEvents(parsed.calendarEvents);
        if (parsed.notes) saveStoredNotes(parsed.notes);
        if (parsed.grades) saveStoredGrades(parsed.grades);
        if (parsed.temperatureUnit) setStoredTempUnit(parsed.temperatureUnit);

        showStatus("success", "Datele au fost restaurate cu succes!");
      } catch (err) {
        console.error(err);
        showStatus("error", "Fișierul JSON nu este valid.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleResetAll = () => {
    if (confirm("Sigur dorești să resetezi toate datele (orar, sarcini, calendar, notițe) la valorile inițiale?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-nord-4/60 px-2">
        Copie de siguranță &amp; Date
      </p>

      <GlassCard className="p-4 space-y-3">
        <p className="text-xs text-nord-4/70 leading-relaxed">
          Toate datele tale sunt stocate local pe dispozitiv. Poți descărca o copie JSON sau poți importa un backup existent.
        </p>

        {statusMessage && (
          <div
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-fade-in ${
              statusMessage.type === "success"
                ? "bg-nord-14/15 border-nord-14/30 text-nord-14"
                : "bg-nord-11/15 border-nord-11/30 text-nord-11"
            }`}
          >
            {statusMessage.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="glass"
            size="sm"
            onClick={handleExport}
            className="text-xs font-semibold text-nord-8 flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportă JSON</span>
          </Button>

          <Button
            variant="glass"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-semibold text-nord-9 flex items-center justify-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importă JSON</span>
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center">
          <span className="text-[11px] text-nord-4/50">Resetare totală aplicație</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="text-xs text-nord-11 hover:text-nord-11/80"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Resetare la zero</span>
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
