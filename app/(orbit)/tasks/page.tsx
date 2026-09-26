"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, Plus, Calendar, Check, Edit2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TaskModal } from "@/components/tasks/TaskModal";
import { useTasks } from "@/lib/tasks/useTasks";
import { TaskItem } from "@/types/tasks";
import { getRelativeDateLabel, isDateToday, isDateUpcoming } from "@/lib/utils/dateUtils";
import { t } from "@/lib/i18n";

type TabType = "Astăzi" | "Viitoare" | "Toate" | "Finalizate";

export default function TasksPage() {
  const [currentTab, setCurrentTab] = useState<TabType>("Astăzi");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);

  const { tasks, toggleTask, addTask, updateTask, deleteTask } = useTasks();

  const handleOpenAdd = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: TaskItem) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter((tItem) => {
    if (currentTab === "Astăzi") return !tItem.completed && (!tItem.dueDate || isDateToday(tItem.dueDate));
    if (currentTab === "Viitoare") return !tItem.completed && isDateUpcoming(tItem.dueDate);
    if (currentTab === "Finalizate") return tItem.completed;
    return true; // "Toate"
  });

  const todayCount = tasks.filter((tItem) => !tItem.completed && (!tItem.dueDate || isDateToday(tItem.dueDate))).length;
  const upcomingCount = tasks.filter((tItem) => !tItem.completed && isDateUpcoming(tItem.dueDate)).length;
  const completedCount = tasks.filter((tItem) => tItem.completed).length;

  const tabs: TabType[] = ["Astăzi", "Viitoare", "Toate", "Finalizate"];

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-nord-6 tracking-tight">
            {t.tasks.title}
          </h1>
          <p className="text-xs text-nord-4/60 font-medium mt-0.5">
            {tasks.filter((tItem) => !tItem.completed).length} {t.tasks.activeCount}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenAdd}
          className="rounded-full px-3.5 h-8 text-xs font-semibold shadow-[0_0_15px_rgba(136,192,208,0.35)]"
        >
          <Plus className="w-3.5 h-3.5 mr-1 stroke-[2.8]" />
          <span>{t.tasks.newTask}</span>
        </Button>
      </div>

      {/* Segmented iOS Glass Tab Bar */}
      <div className="flex p-1.5 rounded-[22px] bg-[#0E1524]/80 border border-white/[0.08] backdrop-blur-xl shadow-inner">
        {tabs.map((tab) => {
          const isSelected = currentTab === tab;
          const count =
            tab === "Astăzi"
              ? todayCount
              : tab === "Viitoare"
              ? upcomingCount
              : tab === "Finalizate"
              ? completedCount
              : tasks.length;

          return (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`flex-1 py-2 text-xs font-medium rounded-2xl transition-all duration-200 flex items-center justify-center gap-1.5 select-none ${
                isSelected
                  ? "bg-nord-8 text-[#070A0F] font-bold shadow-[0_4px_16px_rgba(136,192,208,0.4)]"
                  : "text-nord-4/70 hover:text-nord-6 hover:bg-white/[0.03]"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-[#070A0F]/20 text-[#070A0F]" : "bg-white/[0.06] text-nord-4/50"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <GlassCard className="p-8 sm:p-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-nord-8">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-nord-5">{t.tasks.empty}</p>
            <p className="text-xs text-nord-4/60 max-w-xs mx-auto">
              {t.tasks.emptySubtext}
            </p>
            <div className="pt-2">
              <Button variant="glass" size="sm" onClick={handleOpenAdd} className="text-xs text-nord-8">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Adaugă prima sarcină
              </Button>
            </div>
          </GlassCard>
        ) : (
          filteredTasks.map((task) => (
            <GlassCard
              key={task.id}
              className={`p-4 transition-all duration-200 ${
                task.completed
                  ? "opacity-45 bg-white/[0.015] border-white/[0.03]"
                  : "hover:border-nord-8/30 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? t.tasks.markIncomplete : t.tasks.markComplete}
                  className="mt-0.5 text-nord-4 hover:text-nord-8 transition-transform active:scale-90 shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-nord-14 drop-shadow-[0_0_8px_rgba(163,190,140,0.5)]" />
                  ) : (
                    <Circle className="w-5 h-5 text-nord-4/40 hover:text-nord-8" />
                  )}
                </button>

                <div className="flex-1 min-w-0" onClick={() => handleOpenEdit(task)}>
                  <div className="flex items-center justify-between gap-2 cursor-pointer">
                    <h3
                      className={`text-sm sm:text-base font-bold truncate transition-colors ${
                        task.completed ? "line-through text-nord-4/40" : "text-nord-6 hover:text-nord-8"
                      }`}
                    >
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {task.subject && (
                        <span className="text-[10px] font-semibold text-nord-9 bg-nord-9/10 border border-nord-9/20 px-2 py-0.5 rounded-lg">
                          {task.subject}
                        </span>
                      )}

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
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-xs text-nord-4/70 mt-1 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3.5 mt-2.5 text-[11px] text-nord-4/50 font-medium">
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-nord-9" />
                        {getRelativeDateLabel(task.dueDate)}
                      </span>
                    )}
                    {task.dueTime && (
                      <span className="flex items-center gap-1 text-nord-8 font-mono">
                        <Clock className="w-3 h-3" />
                        Până la {task.dueTime}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(task)}
                  aria-label="Editează sarcina"
                  className="text-nord-4/40 hover:text-nord-8 p-1 rounded-lg hover:bg-white/[0.04] transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
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
