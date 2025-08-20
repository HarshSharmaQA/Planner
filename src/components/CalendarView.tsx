import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useThemeStore } from '../store/themeStore';
import { Task, FilterOptions } from '../types';
import { filterTasks } from '../utils/taskFilters';
import { formatTime } from '../utils/dateHelpers';

interface CalendarViewProps {
  searchQuery: string;
  filters: FilterOptions;
  onEditTask: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  searchQuery,
  filters,
  onEditTask
}) => {
  const { tasks } = useTaskStore();
  const { darkMode } = useThemeStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [viewMode, setViewMode] = useState<CalendarViewMode>('month');

  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, searchQuery, filters);
  }, [tasks, searchQuery, filters]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date();

  const calendarDays = useMemo(() => {
    const days = [];
    
    // Previous month's trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), -i);
      days.push({
        date,
        isCurrentMonth: false,
        tasks: []
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === date.toDateString();
      });

      days.push({
        date,
        isCurrentMonth: true,
        tasks: dayTasks
      });
    }

    // Next month's leading days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        tasks: []
      });
    }

    return days;
  }, [currentDate, filteredTasks, daysInMonth, firstDayOfMonth]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Calendar
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h3 className={`text-xl font-semibold min-w-[200px] text-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            
            <button
              onClick={() => navigateMonth('next')}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={goToToday}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={`rounded-xl border overflow-hidden ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        {/* Days of Week Header */}
        <div className={`grid grid-cols-7 border-b ${
          darkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className={`p-4 text-center text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const isToday = day.date.toDateString() === today.toDateString();
            const hasOverdue = day.tasks.some(task => 
              new Date(task.dueDate) < today && task.status.name !== 'Completed'
            );

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b transition-colors hover:bg-opacity-50 ${
                  darkMode 
                    ? 'border-gray-700 hover:bg-gray-700'
                    : 'border-gray-200 hover:bg-gray-50'
                } ${!day.isCurrentMonth ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isToday
                      ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center'
                      : darkMode 
                        ? 'text-gray-300'
                        : 'text-gray-700'
                  } ${hasOverdue && !isToday ? 'text-red-500' : ''}`}>
                    {day.date.getDate()}
                  </span>
                  {day.tasks.length > 3 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      +{day.tasks.length - 3}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {day.tasks.slice(0, 3).map(task => (
                    <button
                      key={task.id}
                      onClick={() => onEditTask(task)}
                      className={`w-full text-left p-1.5 rounded text-xs transition-all hover:scale-105 hover:shadow-sm ${
                        task.status.name === 'Completed' ? 'opacity-60' : ''
                      }`}
                      style={{ 
                        backgroundColor: `${task.category.color}20`,
                        borderLeft: `3px solid ${task.category.color}`
                      }}
                    >
                      <div className={`font-medium truncate ${
                        task.status.name === 'Completed' ? 'line-through' : ''
                      }`} style={{ color: task.category.color }}>
                        {task.title}
                      </div>
                      {task.estimatedTime && (
                        <div className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {formatTime(task.estimatedTime)}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};