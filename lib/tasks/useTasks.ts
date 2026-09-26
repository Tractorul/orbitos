"use client";

import { useState, useEffect, useCallback } from "react";
import { TaskItem } from "@/types/tasks";
import {
  getStoredTasks,
  addTask as storeAddTask,
  updateTask as storeUpdateTask,
  toggleTaskCompleted as storeToggleTask,
  deleteTask as storeDeleteTask,
  subscribeToTasks,
} from "./taskStore";

export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    const data = getStoredTasks();
    setTasks(data);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribeToTasks(refresh);
    return () => unsubscribe();
  }, [refresh]);

  const addTask = useCallback((task: Omit<TaskItem, "id" | "createdAt">) => {
    return storeAddTask(task);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<TaskItem>) => {
    storeUpdateTask(id, updates);
  }, []);

  const toggleTask = useCallback((id: string) => {
    storeToggleTask(id);
  }, []);

  const deleteTask = useCallback((id: string) => {
    storeDeleteTask(id);
  }, []);

  return {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    refresh,
  };
}
