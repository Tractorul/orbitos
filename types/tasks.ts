export type TaskPriority = "Scăzută" | "Normală" | "Ridicată";

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  subject?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}
