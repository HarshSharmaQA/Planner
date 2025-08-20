import React from 'react';
import { 
  Clock, 
  Calendar, 
  Tag, 
  MoreVertical, 
  CheckCircle2, 
  Circle,
  Edit,
  Trash2,
  User,
  CheckSquare
} from 'lucide-react';
import { Task } from '../types';
import { useThemeStore } from '../store/themeStore';
import { formatDate, formatTime } from '../utils/dateHelpers';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  const { darkMode } = useThemeStore();
  const [showActions, setShowActions] = React.useState(false);

  const isOverdue = new Date(task.dueDate) < new Date() && task.status.name !== 'Completed';
  const isCompleted = task.status.name === 'Completed';

  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/25' 
          : 'bg-white border-gray-200 hover:shadow-gray-200/50'
      } ${isOverdue ? 'ring-2 ring-red-500/20' : ''}`}
    >
      {/* Priority Indicator */}
      <div 
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: task.priority.color }}
      />

      {/* Card Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={() => onToggleStatus(task.id)}
              className={`mt-1 transition-colors ${
                isCompleted 
                  ? 'text-green-500 hover:text-green-600'
                  : darkMode
                    ? 'text-gray-400 hover:text-green-400'
                    : 'text-gray-400 hover:text-green-500'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm mb-1 leading-tight ${
                isCompleted 
                  ? darkMode ? 'text-gray-400 line-through' : 'text-gray-500 line-through'
                  : darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-xs leading-relaxed ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description.length > 100 
                    ? `${task.description.substring(0, 100)}...`
                    : task.description
                  }
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className={`p-1 rounded-md transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showActions && (
              <div className={`absolute right-0 top-8 w-32 rounded-lg border shadow-lg z-10 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowActions(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 text-sm transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {task.progress > 0 && (
          <div className="mb-3">
            <div className={`flex items-center justify-between text-xs mb-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <div className={`w-full h-2 rounded-full ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${task.progress}%`,
                  backgroundColor: task.status.color
                }}
              />
            </div>
          </div>
        )}

        {/* Subtasks */}
        {totalSubtasks > 0 && (
          <div className={`flex items-center space-x-2 text-xs mb-3 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <CheckSquare className="w-3 h-3" />
            <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2">
          {/* Category and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span
                className="px-2 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: task.category.color }}
              >
                {task.category.name}
              </span>
              <span
                className="px-2 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: task.status.color }}
              >
                {task.status.name}
              </span>
            </div>
            <span
              className="px-2 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: task.priority.color }}
            >
              {task.priority.name}
            </span>
          </div>

          {/* Due Date and Time */}
          <div className="flex items-center justify-between text-xs">
            <div className={`flex items-center space-x-1 ${
              isOverdue ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
            
            {task.estimatedTime && (
              <div className={`flex items-center space-x-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Clock className="w-3 h-3" />
                <span>{formatTime(task.estimatedTime)}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <Tag className={`w-3 h-3 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`} />
              <div className="flex flex-wrap gap-1">
                {task.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className={`px-1.5 py-0.5 text-xs rounded ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className={`px-1.5 py-0.5 text-xs rounded ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    +{task.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Assignee */}
          {task.assignee && (
            <div className={`flex items-center space-x-1 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <User className="w-3 h-3" />
              <span>{task.assignee}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
        darkMode ? 'from-transparent to-blue-400/10' : ''
      }`} />
    </div>
  );
};