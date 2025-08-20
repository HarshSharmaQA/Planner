import React, { useMemo } from 'react';
import { TaskCard } from './TaskCard';
import { useTaskStore } from '../store/taskStore';
import { useThemeStore } from '../store/themeStore';
import { Task, FilterOptions } from '../types';
import { filterTasks, sortTasks } from '../utils/taskFilters';
import { CheckSquare } from 'lucide-react';

interface TaskListProps {
  searchQuery: string;
  filters: FilterOptions;
  onEditTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  searchQuery,
  filters,
  onEditTask
}) => {
  const { tasks, toggleTaskStatus, deleteTask } = useTaskStore();
  const { darkMode } = useThemeStore();

  const filteredAndSortedTasks = useMemo(() => {
    let result = filterTasks(tasks, searchQuery, filters);
    result = sortTasks(result, filters.sortBy, filters.sortOrder);
    return result;
  }, [tasks, searchQuery, filters]);

  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: Task[] } = {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    filteredAndSortedTasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

      if (dueDateOnly < today && task.status.name !== 'Completed') {
        groups.overdue.push(task);
      } else if (dueDateOnly.getTime() === today.getTime()) {
        groups.today.push(task);
      } else if (dueDateOnly.getTime() === tomorrow.getTime()) {
        groups.tomorrow.push(task);
      } else if (dueDateOnly <= weekEnd) {
        groups.thisWeek.push(task);
      } else {
        groups.later.push(task);
      }
    });

    return groups;
  }, [filteredAndSortedTasks]);

  const groupLabels = {
    overdue: { label: 'Overdue', color: 'text-red-500', count: groupedTasks.overdue.length },
    today: { label: 'Today', color: 'text-blue-500', count: groupedTasks.today.length },
    tomorrow: { label: 'Tomorrow', color: 'text-purple-500', count: groupedTasks.tomorrow.length },
    thisWeek: { label: 'This Week', color: 'text-green-500', count: groupedTasks.thisWeek.length },
    later: { label: 'Later', color: 'text-gray-500', count: groupedTasks.later.length }
  };

  if (filteredAndSortedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <CheckSquare className={`w-12 h-12 ${
            darkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          No tasks found
        </h3>
        <p className={`text-center max-w-md ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {searchQuery || Object.values(filters).some(f => f && f.length > 0)
            ? 'Try adjusting your search or filters to find what you\'re looking for.'
            : 'Create your first task to get started with planning your day.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Tasks
        </h2>
        <span className={`text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {filteredAndSortedTasks.length} task{filteredAndSortedTasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {Object.entries(groupedTasks).map(([groupKey, groupTasks]) => {
        if (groupTasks.length === 0) return null;
        
        const groupInfo = groupLabels[groupKey as keyof typeof groupLabels];
        
        return (
          <div key={groupKey} className="space-y-4">
            <div className="flex items-center space-x-3">
              <h3 className={`text-lg font-semibold ${groupInfo.color}`}>
                {groupInfo.label}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {groupInfo.count}
              </span>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groupTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onToggleStatus={toggleTaskStatus}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};