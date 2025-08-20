import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart3,
  Settings,
  Users,
  Archive
} from 'lucide-react';
import { ViewMode } from '../types';
import { useThemeStore } from '../store/themeStore';
import { useTaskStore } from '../store/taskStore';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { darkMode } = useThemeStore();
  const { getOverdueTasks, getTodayTasks, getThisWeekTasks } = useTaskStore();

  const overdueTasks = getOverdueTasks();
  const todayTasks = getTodayTasks();
  const thisWeekTasks = getThisWeekTasks();

  const menuItems = [
    {
      id: 'dashboard' as ViewMode,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'tasks' as ViewMode,
      label: 'Tasks',
      icon: CheckSquare,
      badge: overdueTasks.length > 0 ? overdueTasks.length : null
    },
    {
      id: 'calendar' as ViewMode,
      label: 'Calendar',
      icon: Calendar,
      badge: todayTasks.length > 0 ? todayTasks.length : null
    },
    {
      id: 'analytics' as ViewMode,
      label: 'Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'team' as ViewMode,
      label: 'Team',
      icon: Users,
      badge: null
    },
    {
      id: 'settings' as ViewMode,
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  const quickStats = [
    { label: 'Today', count: todayTasks.length, color: 'text-blue-500' },
    { label: 'This Week', count: thisWeekTasks.length, color: 'text-purple-500' },
    { label: 'Overdue', count: overdueTasks.length, color: 'text-red-500' }
  ];

  return (
    <aside className={`w-64 h-screen sticky top-0 border-r transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? darkMode
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-blue-500 text-white shadow-lg'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8">
          <h3 className={`text-sm font-semibold mb-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Quick Stats
          </h3>
          <div className="space-y-3">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-750' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {stat.label}
                </span>
                <span className={`font-bold ${stat.color}`}>
                  {stat.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Archive Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <button className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-600'
            }`}>
              <Archive className="w-4 h-4" />
              <span className="text-sm">Archived Tasks</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};