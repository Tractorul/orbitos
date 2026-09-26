import { TaskItem } from "@/types/tasks";

const TASKS_STORAGE_KEY = "orbit_tasks_v1";
const TASKS_EVENT = "orbit_tasks_updated";

const DEMO_TASK_IDS = new Set(["task-1", "task-2", "task-3", "task-4", "1", "2", "3", "4"]);

export function getDefaultTasks(): TaskItem[] {
  return [];
}

export function getStoredTasks(): TaskItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((t) => !DEMO_TASK_IDS.has(t.id));
        if (cleaned.length !== parsed.length) {
          saveStoredTasks(cleaned);
        }
        return cleaned;
      }
    }
  } catch (err) {
    console.warn("[taskStore] Failed to read tasks from localStorage", err);
  }
  return [];
}

export function saveStoredTasks(tasks: TaskItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    window.dispatchEvent(new Event(TASKS_EVENT));
  } catch (err) {
    console.warn("[taskStore] Failed to save tasks to localStorage", err);
  }
}

export function addTask(task: Omit<TaskItem, "id" | "createdAt">): TaskItem {
  const current = getStoredTasks();
  const newTask: TaskItem = {
    ...task,
    id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newTask, ...current];
  saveStoredTasks(updated);
  return newTask;
}

export function updateTask(id: string, updates: Partial<TaskItem>): void {
  const current = getStoredTasks();
  const updated = current.map((t) => (t.id === id ? { ...t, ...updates } : t));
  saveStoredTasks(updated);
}

export function toggleTaskCompleted(id: string): void {
  const current = getStoredTasks();
  const updated = current.map((t) => {
    if (t.id === id) {
      const completed = !t.completed;
      return {
        ...t,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
      };
    }
    return t;
  });
  saveStoredTasks(updated);
}

export function deleteTask(id: string): void {
  const current = getStoredTasks();
  const updated = current.filter((t) => t.id !== id);
  saveStoredTasks(updated);
}

export function subscribeToTasks(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(TASKS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(TASKS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
