import React from 'react';
import { Search, Filter, Plus, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleFilters: () => void;
  onCreateTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onToggleFilters,
  onCreateTask
}) => {
  const { darkMode, toggleDarkMode } = useThemeStore();

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900/80 border-gray-700' 
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
              }`}>
                ZZ
              </div>
              <h1 className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Planner
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`pl-10 pr-4 py-2 w-64 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleFilters}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title="Toggle Filters"
              >
                <Filter className="w-5 h-5" />
              </button>

              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={onCreateTask}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};