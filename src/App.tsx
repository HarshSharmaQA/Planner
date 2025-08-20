import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TaskList } from './components/TaskList';
import { CalendarView } from './components/CalendarView';
import { Dashboard } from './components/Dashboard';
import FilterPanel from './components/FilterPanel';
import { TaskModal } from './components/TaskModal';
import { Analytics } from './components/Analytics';
import { Team } from './components/Team';
import { Settings } from './components/Settings';
import { useTaskStore } from './store/taskStore';
import { useThemeStore } from './store/themeStore';
import { Task, ViewMode, FilterOptions } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('tasks');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priorities: [],
    statuses: [],
    dateRange: null,
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });

  const { darkMode } = useThemeStore();
  const { initializeData } = useTaskStore();

  useEffect(() => {
    try {
      initializeData();
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
  }, [initializeData]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    if (!task) return;
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleFilters={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
        onCreateTask={handleCreateTask}
      />
      
      <div className="flex">
        <Sidebar 
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        
        <main className={`flex-1 transition-all duration-300 ${
          isFilterPanelOpen ? 'mr-80' : ''
        }`}>
          <div className="p-6">
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'tasks' && (
              <TaskList
                searchQuery={searchQuery}
                filters={filters}
                onEditTask={handleEditTask}
              />
            )}
            {currentView === 'calendar' && (
              <CalendarView
                searchQuery={searchQuery}
                filters={filters}
                onEditTask={handleEditTask}
              />
            )}
            {currentView === 'analytics' && <Analytics />}
            {currentView === 'team' && <Team />}
            {currentView === 'settings' && <Settings />}
          </div>
        </main>
        
        {isFilterPanelOpen && (
          <FilterPanel
            filters={filters}
            onFiltersChange={(newFilters: FilterOptions) => setFilters(newFilters)}
            onClose={() => setIsFilterPanelOpen(false)}
          />
        )}
      </div>

      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          task={editingTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;