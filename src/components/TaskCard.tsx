'use client';

import { Task } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  CheckIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // ✅ CORREGIR: ahora status es boolean
  const getStatusColor = (status: boolean) => {
    return status 
      ? 'text-green-600 border-green-200 bg-green-50'  // completada (true)
      : 'text-gray-600 border-gray-200 bg-white';      // pendiente (false)
  };

  // ✅ CORREGIR: función para mostrar texto del status
  const getStatusText = (status: boolean) => {
    return status ? 'Completada' : 'Pendiente';
  };

  return (
    <div className={`rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${getStatusColor(task.status)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* ✅ CORREGIR: verificar boolean en lugar de string */}
          <h3 className={`text-lg font-semibold ${task.status ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-4">
            {/* Priority Badge */}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority === 'high' && <ExclamationTriangleIcon className="w-3 h-3 mr-1" />}
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>

            {/* ✅ NUEVO: Status Badge */}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              task.status 
                ? 'text-green-600 bg-green-100' 
                : 'text-gray-600 bg-gray-100'
            }`}>
              {task.status && <CheckIcon className="w-3 h-3 mr-1" />}
              {getStatusText(task.status)}
            </span>

            {/* Due Date */}
            {task.due_date && (
              <div className="flex items-center text-xs text-gray-500">
                <ClockIcon className="w-3 h-3 mr-1" />
                {format(new Date(task.due_date), 'dd MMM yyyy', { locale: es })}
              </div>
            )}

            {/* Created Date */}
            <div className="text-xs text-gray-400">
              {format(new Date(task.created_at), 'dd MMM yyyy', { locale: es })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          {/* ✅ CORREGIR: verificar boolean en lugar de string */}
          {!task.status && (
            <button
              onClick={() => onComplete(task.id)}
              className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors"
              title="Marcar como completada"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
            title="Editar tarea"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
            title="Eliminar tarea"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}