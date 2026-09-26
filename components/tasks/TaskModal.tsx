"use client";

import { useState, useEffect } from "react";
import { ActionSheet } from "@/components/ui/ActionSheet";
import { Button } from "@/components/ui/Button";
import { TaskItem, TaskPriority } from "@/types/tasks";
import { getTodayDateString } from "@/lib/utils/dateUtils";
import { Trash2 } from "lucide-react";
import { t } from "@/lib/i18n";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: TaskItem | null;
  onSave: (task: Omit<TaskItem, "id" | "createdAt">) => void;
  onUpdate?: (id: string, updates: Partial<TaskItem>) => void;
  onDelete?: (id: string) => void;
  defaultDueDate?: string;
}

export function TaskModal({
  isOpen,
  onClose,
  taskToEdit,
  onSave,
  onUpdate,
  onDelete,
  defaultDueDate,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Normală");
  const [dueDate, setDueDate] = useState(defaultDueDate || getTodayDateString());
  const [dueTime, setDueTime] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate || getTodayDateString());
      setDueTime(taskToEdit.dueTime || "");
      setSubject(taskToEdit.subject || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("Normală");
      setDueDate(defaultDueDate || getTodayDateString());
      setDueTime("");
      setSubject("");
    }
  }, [taskToEdit, defaultDueDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit && onUpdate) {
      onUpdate(taskToEdit.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
        dueTime: dueTime || undefined,
        subject: subject.trim() || undefined,
      });
    } else {
      onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
        dueTime: dueTime || undefined,
        subject: subject.trim() || undefined,
        completed: false,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (taskToEdit && onDelete) {
      onDelete(taskToEdit.id);
      onClose();
    }
  };

  const commonSubjects = [
    "Matematică",
    "Română",
    "Fizică",
    "Chimie",
    "Biologie",
    "Engleză",
    "Istorie",
    "Geografie",
    "TIC",
    "Personal",
  ];

  return (
    <ActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? "Modifică sarcina" : "Sarcină nouă"}
      description={taskToEdit ? "Actualizează detaliile sarcinii" : "Introdu detaliile sarcinii de realizat"}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1 pb-1">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
            Titlu sarcină *
          </label>
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Rezolvă fișa de exerciții..."
            className="w-full glass-input rounded-2xl px-4 py-3 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
            Descriere / Notițe
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalii suplimentare, cerințe..."
            className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-nord-6 placeholder:text-nord-4/40 focus:outline-none resize-none"
          />
        </div>

        {/* Priority Segmented Control */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
            Prioritate
          </label>
          <div className="grid grid-cols-3 gap-2 bg-[#0E1524] p-1.5 rounded-2xl border border-white/[0.08]">
            {(["Scăzută", "Normală", "Ridicată"] as TaskPriority[]).map((p) => {
              const isSelected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    isSelected
                      ? p === "Ridicată"
                        ? "bg-nord-11 text-white shadow-[0_2px_10px_rgba(191,97,106,0.4)]"
                        : p === "Normală"
                        ? "bg-nord-8 text-[#070A0F] shadow-[0_2px_10px_rgba(136,192,208,0.4)]"
                        : "bg-nord-14 text-[#070A0F] shadow-[0_2px_10px_rgba(163,190,140,0.4)]"
                      : "text-nord-4/60 hover:text-nord-6 hover:bg-white/[0.03]"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Chips */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
            Materie / Categorie
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {commonSubjects.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setSubject(subject === s ? "" : s)}
                className={`text-[11px] px-2.5 py-1 rounded-xl font-medium transition-all ${
                  subject === s
                    ? "bg-nord-8 text-[#070A0F] font-bold shadow-[0_0_10px_rgba(136,192,208,0.3)]"
                    : "bg-white/[0.04] text-nord-4/70 hover:bg-white/[0.08] hover:text-nord-6 border border-white/[0.06]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Dată limită
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs text-nord-6 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-nord-4/80 mb-1.5">
              Oră limită
            </label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full glass-input rounded-2xl px-3.5 py-2.5 text-xs text-nord-6 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-3">
          {taskToEdit && onDelete && (
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
            {taskToEdit ? t.common.save : "Adaugă sarcină"}
          </Button>
        </div>
      </form>
    </ActionSheet>
  );
}
