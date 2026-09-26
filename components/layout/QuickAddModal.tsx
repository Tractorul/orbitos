"use client";

import { useState } from "react";
import { ActionSheet } from "@/components/ui/ActionSheet";
import {
  CheckSquare,
  FileText,
  CalendarDays,
  Bell,
  Plus,
} from "lucide-react";
import { t } from "@/lib/i18n";
import { TaskModal } from "@/components/tasks/TaskModal";
import { EventModal } from "@/components/calendar/EventModal";
import { NoteModal } from "@/components/notes/NoteModal";
import { useTasks } from "@/lib/tasks/useTasks";
import { useCalendar } from "@/lib/calendar/useCalendar";
import { useNotes } from "@/lib/notes/useNotes";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const [activeModal, setActiveModal] = useState<"none" | "task" | "event" | "note" | "reminder">("none");

  const { addTask } = useTasks();
  const { addEvent } = useCalendar();
  const { addNote } = useNotes();

  const handleSelect = (type: "task" | "event" | "note" | "reminder") => {
    onClose();
    setTimeout(() => {
      setActiveModal(type);
    }, 150);
  };

  const actions = [
    {
      id: "task" as const,
      title: t.quickAdd.task.title,
      description: t.quickAdd.task.desc,
      icon: CheckSquare,
      color: "text-nord-8 bg-nord-8/15 border-nord-8/30 shadow-[0_0_15px_rgba(136,192,208,0.2)]",
    },
    {
      id: "event" as const,
      title: t.quickAdd.event.title,
      description: t.quickAdd.event.desc,
      icon: CalendarDays,
      color: "text-nord-9 bg-nord-9/15 border-nord-9/30 shadow-[0_0_15px_rgba(129,161,193,0.2)]",
    },
    {
      id: "note" as const,
      title: t.quickAdd.note.title,
      description: t.quickAdd.note.desc,
      icon: FileText,
      color: "text-nord-14 bg-nord-14/15 border-nord-14/30 shadow-[0_0_15px_rgba(163,190,140,0.2)]",
    },
    {
      id: "reminder" as const,
      title: t.quickAdd.reminder.title,
      description: t.quickAdd.reminder.desc,
      icon: Bell,
      color: "text-nord-13 bg-nord-13/15 border-nord-13/30 shadow-[0_0_15px_rgba(235,203,139,0.2)]",
    },
  ];

  return (
    <>
      <ActionSheet
        isOpen={isOpen}
        onClose={onClose}
        title={t.quickAdd.title}
        description={t.quickAdd.description}
      >
        <div className="grid grid-cols-1 gap-2.5 pt-1 pb-1">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => handleSelect(act.id)}
                className="w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] border border-white/[0.08] hover:border-nord-8/40 transition-all duration-200 text-left group shadow-sm"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${act.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-nord-6 group-hover:text-nord-8 transition-colors">
                    {act.title}
                  </div>
                  <div className="text-xs text-nord-4/60 truncate mt-0.5">
                    {act.description}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-nord-4/40 group-hover:text-nord-8 group-hover:bg-nord-8/10 transition-all">
                  <Plus className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </ActionSheet>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={activeModal === "task" || activeModal === "reminder"}
        onClose={() => setActiveModal("none")}
        onSave={(data) => {
          addTask(data);
          setActiveModal("none");
        }}
      />

      {/* Event Creation Modal */}
      <EventModal
        isOpen={activeModal === "event"}
        onClose={() => setActiveModal("none")}
        onSave={(data) => {
          addEvent(data);
          setActiveModal("none");
        }}
      />

      {/* Note Creation Modal */}
      <NoteModal
        isOpen={activeModal === "note"}
        onClose={() => setActiveModal("none")}
        onSave={(data) => {
          addNote(data);
          setActiveModal("none");
        }}
      />
    </>
  );
}
