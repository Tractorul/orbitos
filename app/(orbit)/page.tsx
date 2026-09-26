"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Clock,
  Bell,
  ChevronRight,
  Plus,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { AppHeader } from "@/components/layout/AppHeader";
import { QuickAddModal } from "@/components/layout/QuickAddModal";
import { SchoolCard } from "@/components/school/SchoolCard";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { TaskModal } from "@/components/tasks/TaskModal";
import { useTasks } from "@/lib/tasks/useTasks";
import { useCalendar } from "@/lib/calendar/useCalendar";
import { getTodayDateString, getRelativeDateLabel, isDateToday } from "@/lib/utils/dateUtils";
import { TaskItem } from "@/types/tasks";
import { t } from "@/lib/i18n";

export default function HomePage() {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);

  const { tasks, toggleTask, addTask, updateTask, deleteTask } = useTasks();
  const { events } = useCalendar();

  const todayStr = getTodayDateString();

  // Filter today's tasks or pending tasks
  const todaysTasks = tasks.filter((task) => !task.dueDate || isDateToday(task.dueDate));
  const displayTasks = todaysTasks.length > 0 ? todaysTasks : tasks.slice(0, 4);
  const pendingCount = tasks.filter((t) => !t.completed).length;

  // Upcoming reminders / events for today & tomorrow
  const upcomingEvents = events
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    .slice(0, 3);

  const handleOpenEditTask = (e: React.MouseEvent, task: TaskItem) => {
    e.stopPropagation();
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in pb-4">
      {/* 1. Header (Greeting + dynamic Romanian date & time) */}
      <AppHeader onQuickAdd={() => setIsQuickAddOpen(true)} />

      {/* 2. Weather Widget (Real Open-Meteo Frosted Glass Widget) */}
      <WeatherCard />

      {/* 3. School Schedule & Live ACUM / URMEAZĂ Status */}
      <SchoolCard />

      {/* 4. Today's Tasks */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-nord-8/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-nord-8" />
            <span>Sarcini de astăzi</span>
            <span className="text-nord-4/40">({pendingCount})</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTaskToEdit(null);
                setIsTaskModalOpen(true);
              }}
              className="text-xs text-nord-8 hover:text-nord-7 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adaugă</span>
            </button>

            <Link
              href="/tasks"
              className="text-xs text-nord-4/60 hover:text-nord-8 flex items-center gap-0.5 font-medium transition-colors group"
            >
              <span>{t.tasks.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <GlassCard className="p-3.5 sm:p-4">
          {displayTasks.length === 0 ? (
            <div className="text-center py-6 text-nord-4/60 text-xs">
              <p className="font-semibold text-nord-5">{t.tasks.empty}</p>
              <p className="mt-1">{t.tasks.emptySubtext}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer group ${
                    task.completed
                      ? "bg-white/[0.015] border-white/[0.03] opacity-45"
                      : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-nord-8/30 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTask(task.id);
                      }}
                      aria-label={task.completed ? t.tasks.markIncomplete : t.tasks.markComplete}
                      className="text-nord-4 hover:text-nord-8 transition-transform active:scale-90 shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-nord-14 drop-shadow-[0_0_8px_rgba(163,190,140,0.5)]" />
                      ) : (
                        <Circle className="w-5 h-5 text-nord-4/40 group-hover:text-nord-8" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate transition-colors ${
                          task.completed ? "line-through text-nord-4/40" : "text-nord-6"
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-nord-4/50">
                        {task.dueTime && (
                          <span className="flex items-center gap-1 font-mono text-nord-8/90">
                            <Clock className="w-3 h-3" />
                            {task.dueTime}
                          </span>
                        )}
                        {task.subject && (
                          <>
                            <span>•</span>
                            <span className="truncate text-nord-4/70">{task.subject}</span>
                          </>
                        )}
                        {task.description && !task.subject && (
                          <>
                            <span>•</span>
                            <span className="truncate">{task.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2 flex items-center gap-2">
                    <Badge
                      variant={
                        task.priority === "Ridicată"
                          ? "red"
                          : task.priority === "Normală"
                          ? "blue"
                          : "default"
                      }
                      size="sm"
                      dot
                    >
                      {task.priority}
                    </Badge>

                    <button
                      type="button"
                      onClick={(e) => handleOpenEditTask(e, task)}
                      className="opacity-0 group-hover:opacity-100 text-nord-4/40 hover:text-nord-8 transition-opacity p-1"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* 5. Upcoming Reminders & Events */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-nord-8/80">
            <Bell className="w-3.5 h-3.5 text-nord-13" />
            <span>Mementouri &amp; Evenimente</span>
          </div>

          <Link
            href="/calendar"
            className="text-xs text-nord-4/60 hover:text-nord-8 flex items-center gap-0.5 font-medium transition-colors group"
          >
            <span>{t.nav.calendar}</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <GlassCard className="p-3.5 sm:p-4 space-y-2">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-6 text-nord-4/60 text-xs">
              <p className="font-semibold text-nord-5">{t.reminders.empty}</p>
              <p className="mt-1">{t.reminders.emptySubtext}</p>
            </div>
          ) : (
            upcomingEvents.map((ev) => (
              <Link
                key={ev.id}
                href="/calendar"
                className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-nord-8/30 transition-all flex items-center justify-between block group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-nord-8/15 border border-nord-8/30 text-nord-8 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-nord-6 truncate group-hover:text-nord-8 transition-colors">
                      {ev.title}
                    </p>
                    <p className="text-[11px] text-nord-4/60 font-medium font-mono">
                      {getRelativeDateLabel(ev.date)} la {ev.startTime}
                      {ev.location ? ` • ${ev.location}` : ""}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" size="sm" className="font-mono text-nord-4/60">
                  {getRelativeDateLabel(ev.date)}
                </Badge>
              </Link>
            ))
          )}
        </GlassCard>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      {/* Task Modal for Dashboard */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        onSave={addTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
