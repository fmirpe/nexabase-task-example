"use client";

import { useState, useEffect } from "react";
import nexabase from "@/lib/nexabase";
import { Task, CreateTaskData, UpdateTaskData } from "@/types";

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (taskData: CreateTaskData) => Promise<Task>;
  updateTask: (id: string, taskData: UpdateTaskData) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<Task>;
  refetch: () => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (): Promise<void> => {
    try {
      setLoading(true);
      // ✅ Usando el SDK oficial
      const response = await nexabase.listDocuments("task", {
        sort: "-created_at",
        per_page: 100,
      });
      
      setTasks(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error al cargar tareas");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskData): Promise<Task> => {
    try {
      // ✅ Usando el SDK oficial
      const response = await nexabase.createDocument("task", taskData);
      const newTask = response.data;
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err: any) {
      throw new Error(err.message || "Error al crear tarea");
    }
  };

  const updateTask = async (id: string, taskData: UpdateTaskData): Promise<Task> => {
    try {
      // ✅ Usando el SDK oficial - PATCH para actualización parcial
      const response = await nexabase.updateDocument("task", id, taskData);
      const updatedTask = response.data;
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
      );
      return updatedTask;
    } catch (err: any) {
      throw new Error(err.message || "Error al actualizar tarea");
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    try {
      // ✅ Usando el SDK oficial
      await nexabase.deleteDocument("task", id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err: any) {
      throw new Error(err.message || "Error al eliminar tarea");
    }
  };

  const completeTask = async (id: string): Promise<Task> => {
    return updateTask(id, {
      status: true,
      completed_at: new Date().toISOString(),
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    refetch: fetchTasks,
  };
}

export type { Task } from "@/types";
