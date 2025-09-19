"use client";

import { useState, useEffect } from "react";
import nexabase from "@/lib/nexabase";
import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  PaginatedResponse,
} from "@/types";
import { AxiosError } from "axios";

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
      const response = await nexabase.getRecords<Task>("tasks", {
        sort: "-created_at",
        limit: 100,
      });
      setTasks(response.data || []);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "Error al cargar tareas");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskData): Promise<Task> => {
    try {
      const response = await nexabase.createRecord<Task>("tasks", taskData);
      setTasks((prev) => [response, ...prev]);
      return response;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(
        axiosError.response?.data?.message || "Error al crear tarea"
      );
    }
  };

  const updateTask = async (
    id: string,
    taskData: UpdateTaskData
  ): Promise<Task> => {
    try {
      const response = await nexabase.updateRecord<Task>("tasks", id, taskData);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...response } : task))
      );
      return response;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(
        axiosError.response?.data?.message || "Error al actualizar tarea"
      );
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    try {
      await nexabase.deleteRecord("tasks", id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      throw new Error(
        axiosError.response?.data?.message || "Error al eliminar tarea"
      );
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
