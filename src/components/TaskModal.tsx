'use client';

import { useState, useEffect } from 'react';
import { Task, CreateTaskData } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: CreateTaskData) => Promise<void>;
  task?: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    status: false, // ✅ SIEMPRE boolean
    priority: 'medium',
    due_date: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status, // ✅ Ya es boolean
        priority: task.priority,
        due_date: task.due_date ? task.due_date.split('T')[0] : ''
      });
    } else {
      // ✅ CORREGIR: valores por defecto correctos
      setFormData({
        title: '',
        description: '',
        status: false, // ✅ boolean false para "pendiente"
        priority: 'medium',
        due_date: ''
      });
    }
    setError('');
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const taskData: CreateTaskData = {
        ...formData,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : undefined
      };
      
      await onSave(taskData);
      onClose();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ELIMINAR funciones no usadas
  const handleInputChange = (field: keyof CreateTaskData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'low' | 'medium' | 'high';
    setFormData(prev => ({ ...prev, priority: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            {task ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            type="button"
            aria-label="Cerrar modal"
            title="Cerrar modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3" role="alert">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              id="task-title"
              type="text"
              value={formData.title}
              onChange={handleInputChange('title')}
              required
              aria-required="true"
              className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Escribe el título de la tarea"
              title="Título de la tarea (requerido)"
            />
          </div>

          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="task-description"
              value={formData.description}
              onChange={handleInputChange('description')}
              rows={3}
              className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción opcional"
              title="Descripción de la tarea (opcional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-status" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="task-status"
                value={formData.status.toString()} // ✅ Convertir boolean a string
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  status: e.target.value === 'true' // ✅ Convertir string a boolean
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Estado actual de la tarea"
                aria-label="Estado de la tarea"
              >
                <option value="false">Pendiente</option>
                <option value="true">Completada</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                id="task-priority"
                value={formData.priority}
                onChange={handlePriorityChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Nivel de prioridad de la tarea"
                aria-label="Prioridad de la tarea"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha límite
            </label>
            <input
              id="task-due-date"
              type="date"
              value={formData.due_date}
              onChange={handleInputChange('due_date')}
              className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="Fecha límite para completar la tarea"
              aria-label="Fecha límite"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              title="Cancelar y cerrar modal"
              aria-label="Cancelar"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
              title={loading ? 'Guardando tarea...' : (task ? 'Actualizar tarea' : 'Crear nueva tarea')}
              aria-label={loading ? 'Guardando...' : (task ? 'Actualizar tarea' : 'Crear tarea')}
            >
              {loading ? 'Guardando...' : (task ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}