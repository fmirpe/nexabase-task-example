// ✅ app/dashboard/page.tsx - COMPLETO CORREGIDO para boolean status
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks, Task } from '@/hooks/useTasks';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import { CreateTaskData } from '@/types';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const { tasks, loading, error, createTask, updateTask, deleteTask, completeTask } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Loading states
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No autorizado</h2>
          <p className="text-gray-600 mt-2">Por favor, inicia sesión para continuar.</p>
        </div>
      </div>
    );
  }

  // ✅ CORREGIR: Filtrar tareas para boolean status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // ✅ CORREGIR: filtro de status para boolean
    let matchesStatus = true;
    if (filterStatus === 'completed') {
      matchesStatus = task.status === true;
    } else if (filterStatus === 'pending') {
      matchesStatus = task.status === false;
    }
    // Si filterStatus === 'all', matchesStatus sigue siendo true

    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // ✅ CORREGIR: Estadísticas para boolean status
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === true).length,    // ✅ true = completada
    pending: tasks.filter(t => t.status === false).length,    // ✅ false = pendiente
  };

  const handleSaveTask = async (taskData: CreateTaskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask(taskData);
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error saving task:', error.message);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        await deleteTask(id);
      } catch (err) {
        const error = err as Error;
        console.error('Error deleting task:', error.message);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-sm text-gray-600">
                Powered by <span className="font-semibold text-blue-600">NexaBase</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Hola, <span className="font-medium">{user.full_name}</span>
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="Cerrar sesión"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ✅ CORREGIR: Stats Cards - solo 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                {/* ✅ CORREGIR: Select de status actualizado */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="completed">Completadas</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todas las prioridades</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Nueva Tarea
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'No se encontraron tareas'
                  : 'No hay tareas aún'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'Intenta cambiar los filtros de búsqueda'
                  : 'Comienza creando tu primera tarea'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && filterPriority === 'all' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto"
                >
                  <PlusIcon className="w-4 h-4" />
                  Crear Primera Tarea
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <TaskCard
                key={task.id || `task-${index}`}
                task={task}
                onComplete={completeTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}
