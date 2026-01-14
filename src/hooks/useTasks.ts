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
  
  // ✅ Normalizar datos del SDK para asegurar que tengan 'id'
  const mapToTask = (doc: any): Task => {
    return {
      ...doc,
      id: doc.id || doc._id || doc.$id || `temp-${Math.random().toString(36).substr(2, 9)}`, 
    } as Task;
  };

  const fetchTasks = async (): Promise<void> => {
    try {
      setLoading(true);
      // ✅ Usando el SDK oficial
      const response = (await nexabase.listDocuments("task", {
        sort: "-created_at",
        per_page: 100,
      })) as any;
      
      // ✅ Manejar diferentes estructuras de respuesta
      const rawData = response.data || response;
      const docs = Array.isArray(rawData) ? rawData : (rawData.data || []);
      
      setTasks(docs.map(mapToTask));
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar tareas");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskData): Promise<Task> => {
    try {
      // ✅ Usando el SDK oficial
      const response = (await nexabase.createDocument("task", taskData)) as any;
      const newTask = mapToTask(response.data || response);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err: unknown) {
      console.error("Create task detail:", err);
      throw new Error((err as any)?.response?.data?.message || (err as Error).message || "Error al crear tarea");
    }
  };

  const updateTask = async (id: string, taskData: UpdateTaskData): Promise<Task> => {
    try {
      // ✅ Usando el SDK oficial - PATCH para actualización parcial
      const response = (await nexabase.updateDocument("task", id, taskData)) as any;
      const updatedTask = mapToTask(response.data || response);
      
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
      );
      
      // ✅ Opcional: recargar para asegurar sincronización
      // await fetchTasks(); 
      
      return updatedTask;
    } catch (err: unknown) {
      console.error("Update task detail:", err);
      throw new Error((err as any)?.response?.data?.message || (err as Error).message || "Error al actualizar tarea");
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    try {
      // ✅ Usando el SDK oficial
      (await nexabase.deleteDocument("task", id)) as any;
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err: unknown) {
      throw new Error((err as Error).message || "Error al eliminar tarea");
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
