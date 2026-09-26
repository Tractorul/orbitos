"use client";

import { useState, useEffect } from "react";
import { ActionSheet } from "@/components/ui/ActionSheet";
import { Button } from "@/components/ui/Button";
import { CalendarEvent } from "@/types/calendar";
import { getTodayDateString } from "@/lib/utils/dateUtils";
import { Bell, MapPin, Trash2 } from "lucide-react";
import { t } from "@/lib/i18n";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: CalendarEvent | null;
  onSave: (event: Omit<CalendarEvent, "id" | "createdAt">) => void;
  onUpdate?: (id: string, updates: Partial<CalendarEvent>) => void;
  onDelete?: (id: string) => void;
  defaultDate?: string;
}

export function EventModal({
  isOpen,
  onClose,
  eventToEdit,
  onSave,
  onUpdate,
  onDelete,
  defaultDate,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(defaultDate || getTodayDateString());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [location, setLocation] = useState("");
  const [hasReminder, setHasReminder] = useState(true);
  const [colorTag, setColorTag] = useState<"cyan" | "blue" | "green" | "yellow" | "red" | "purple">("cyan");

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description || "");
      setDate(eventToEdit.date || getTodayDateString());
      setStartTime(eventToEdit.startTime);
      setEndTime(eventToEdit.endTime);
      setLocation(eventToEdit.location || "");
      setHasReminder(eventToEdit.hasReminder);
      setColorTag(eventToEdit.colorTag || "cyan");
    } else {
      setTitle("");
      setDescription("");
      setDate(defaultDate || getTodayDateString());
      setStartTime("10:00");
      setEndTime("11:00");
      setLocation("");
      setHasReminder(true);
      setColorTag("cyan");
    }
  }, [eventToEdit, defaultDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !startTime || !endTime) return;

    if (eventToEdit && onUpdate) {
      onUpdate(eventToEdit.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        startTime,
        endTime,
        location: location.trim() || undefined,
        hasReminder,
        colorTag,
      });
    } else {
      onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        startTime,
        endTime,
        location: location.trim() || undefined,
        hasReminder,
        colorTag,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (eventToEdit && onDelete) {
      onDelete(eventToEdit.id);
      onClose();
    }
  };

  const colors = [
    { key: "cyan", bg: "bg-nord-8" },
    { key: "blue", bg: "bg-nord-9" },
    { key: "green", bg: "bg-nord-14" },
    { key: "yellow", bg: "bg-nord-13" },
    { key: "red", bg: "bg-nord-11" },
    { key: "purple", bg: "bg-nord-15" },
  ] as const;

  return (
    <ActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? "Modifică evenimentul" : "Eveniment nou"}
      description={eventToEdit ? "Actualizează programul evenimentului" : "Programează o activitate în calendar"}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1 pb-1">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
            Titlu eveniment *
          </label>
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titlu eveniment sau activitate..."
            className="w-full glass-input rounded-2xl px-4 py-3 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
            Descriere
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Subiecte, notițe..."
            className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none resize-none"
          />
        </div>

        {/* Date & Time Range */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Dată
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs text-nord-6 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
                Ora de început
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs text-nord-6 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
                Ora de sfârșit
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs text-nord-6 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
            Locație / Sală
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-nord-4/40" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Sala de curs, Online..."
              className="w-full glass-input rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none"
            />
          </div>
        </div>

        {/* Color Tag & Reminder Toggle */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Culoare
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setColorTag(c.key)}
                  className={`w-6 h-6 rounded-full ${c.bg} transition-transform ${
                    colorTag === c.key ? "scale-125 ring-2 ring-white" : "opacity-60 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHasReminder(!hasReminder)}
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all text-xs font-medium ${
              hasReminder
                ? "bg-nord-13/15 border-nord-13/30 text-nord-13"
                : "bg-white/[0.04] border-white/[0.08] text-nord-4/50"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Memento {hasReminder ? "Activ" : "Inactiv"}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-3">
          {eventToEdit && onDelete && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleDelete}
              className="text-nord-11 hover:bg-nord-11/15 px-3"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            {t.common.cancel}
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="flex-1 font-bold shadow-[0_0_15px_rgba(136,192,208,0.3)]"
          >
            {eventToEdit ? t.common.save : "Adaugă eveniment"}
          </Button>
        </div>
      </form>
    </ActionSheet>
  );
}
