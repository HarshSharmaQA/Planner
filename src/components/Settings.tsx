import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Bell, Shield, Database, Globe, Palette, Save, Download } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useTaskStore } from '../store/taskStore';

export const Settings: React.FC = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const { tasks, categories, priorities, statuses, teamMembers } = useTaskStore();
  
  const [activeTab, setActiveTab] = useState('appearance');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [language, setLanguage] = useState('en');
  const [accentColor, setAccentColor] = useState('#3B82F6'); // Default blue
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    return () => setter(prev => !prev);
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save settings to backend/localStorage
    console.log('Settings saved');
  };

  const handleExportCSV = () => {
    const headers = [
      'Title',
      'Description',
      'Category',
      'Priority',
      'Status',
      'Due Date',
      'Assignee',
      'Assignee Email',
      'Assignee Role',
      'Progress',
      'Tags',
      'Estimated Time (min)',
      'Actual Time (min)',
      'Created Date',
      'Updated Date'
    ];

    const csvContent = [
      headers.join(','),
      ...tasks.map(task => {
        const assignee = teamMembers.find(member => member.id === task.assignee);
        return [
          `"${task.title.replace(/"/g, '""')}"`,
          `"${task.description.replace(/"/g, '""')}"`,
          task.category.name,
          task.priority.name,
          task.status.name,
          new Date(task.dueDate).toLocaleDateString(),
          assignee ? `"${assignee.name.replace(/"/g, '""')}"` : '',
          assignee ? `"${assignee.email || ''}"` : '',
          assignee ? `"${assignee.role.replace(/"/g, '""')}"` : '',
          task.progress,
          `"${task.tags.join('; ')}"`,
          task.estimatedTime || '',
          task.actualTime || '',
          new Date(task.createdAt).toLocaleDateString(),
          new Date(task.updatedAt).toLocaleDateString()
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      tasks: tasks.map(task => {
        const assignee = teamMembers.find(member => member.id === task.assignee);
        return {
          ...task,
          assignee: assignee ? {
            id: assignee.id,
            name: assignee.name,
            email: assignee.email,
            role: assignee.role,
            department: assignee.department
          } : null,
          category: task.category.name,
          priority: task.priority.name,
          status: task.status.name
        };
      }),
      teamMembers: teamMembers.map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department,
        phone: member.phone,
        joinedDate: member.joinedDate
      })),
      metadata: {
        totalTasks: tasks.length,
        totalTeamMembers: teamMembers.length,
        categories: categories.map(c => c.name),
        priorities: priorities.map(p => p.name),
        statuses: statuses.map(s => s.name)
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks-export-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Theme
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`flex items-center justify-center p-4 rounded-lg border transition-all ${!darkMode ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
          >
            <div className="flex flex-col items-center">
              <Sun className={`w-6 h-6 mb-2 ${!darkMode ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} />
              <span className={`text-sm font-medium ${!darkMode ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>Light</span>
            </div>
          </button>
          <button
            onClick={toggleDarkMode}
            className={`flex items-center justify-center p-4 rounded-lg border transition-all ${darkMode ? 'border-blue-500 bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
          >
            <div className="flex flex-col items-center">
              <Moon className={`w-6 h-6 mb-2 ${darkMode ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>Dark</span>
            </div>
          </button>
        </div>
      </div>
      
      <div>
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Accent Color
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {['#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B'].map(color => (
            <button
              key={color}
              onClick={() => setAccentColor(color)}
              className={`w-full aspect-square rounded-full border-2 ${accentColor === color ? 'border-gray-900 dark:border-white' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
              aria-label={`Select ${color} as accent color`}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Font Size
        </h3>
        <div className="flex items-center space-x-4">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>A</span>
          <input 
            type="range" 
            min="1" 
            max="3" 
            step="1" 
            defaultValue="2"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>A</span>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Enable Notifications
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Receive notifications for task updates and reminders
          </p>
        </div>
        <button 
          onClick={handleToggle(setNotificationsEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
          <span 
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Email Notifications
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Receive task updates via email
          </p>
        </div>
        <button 
          onClick={handleToggle(setEmailNotifications)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
          <span 
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>
      
      <div>
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Notification Types
        </h3>
        <div className="space-y-3">
          {['Task assignments', 'Due date reminders', 'Status changes', 'Comments', 'Team updates'].map(type => (
            <div key={type} className="flex items-center">
              <input
                type="checkbox"
                id={`notification-${type}`}
                defaultChecked
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor={`notification-${type}`} className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Auto-Save Changes
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Automatically save changes to tasks
          </p>
        </div>
        <button 
          onClick={handleToggle(setAutoSave)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoSave ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
          <span 
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoSave ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>
      
      <div>
        <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Data Export
        </h3>
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Export your task data in various formats
        </p>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportCSV}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Export as CSV
          </button>
          <button 
            onClick={handleExportJSON}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Export as JSON
          </button>
        </div>
      </div>
      
      <div>
        <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Data Management
        </h3>
        <div className="space-y-3">
          <button className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <span>Backup Data</span>
            <Database className="w-4 h-4" />
          </button>
          <button className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <span>Restore Data</span>
            <Database className="w-4 h-4" />
          </button>
          <button className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600`}>
            <span>Clear All Data</span>
            <Database className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Language
        </h3>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="ja">日本語</option>
        </select>
      </div>
      
      <div>
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Time Zone
        </h3>
        <select 
          defaultValue="UTC-5"
          className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        >
          <option value="UTC-8">Pacific Time (UTC-8)</option>
          <option value="UTC-7">Mountain Time (UTC-7)</option>
          <option value="UTC-6">Central Time (UTC-6)</option>
          <option value="UTC-5">Eastern Time (UTC-5)</option>
          <option value="UTC+0">UTC</option>
          <option value="UTC+1">Central European Time (UTC+1)</option>
          <option value="UTC+8">China Standard Time (UTC+8)</option>
          <option value="UTC+9">Japan Standard Time (UTC+9)</option>
        </select>
      </div>
      
      <div>
        <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Date Format
        </h3>
        <div className="space-y-3">
          {[
            { value: 'MM/DD/YYYY', example: '05/15/2023' },
            { value: 'DD/MM/YYYY', example: '15/05/2023' },
            { value: 'YYYY-MM-DD', example: '2023-05-15' }
          ].map(format => (
            <div key={format.value} className="flex items-center">
              <input
                type="radio"
                id={`date-${format.value}`}
                name="dateFormat"
                defaultChecked={format.value === 'MM/DD/YYYY'}
                className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor={`date-${format.value}`} className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {format.value} <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>({format.example})</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h2>
        <button 
          onClick={handleSaveSettings}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <nav className="space-y-1">
              {[
                { id: 'appearance', label: 'Appearance', icon: Palette },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'data', label: 'Data & Privacy', icon: Shield },
                { id: 'general', label: 'General', icon: Globe },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? (darkMode ? 'bg-blue-900/30 text-blue-500' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-6">
              <SettingsIcon className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {activeTab === 'appearance' && 'Appearance Settings'}
                {activeTab === 'notifications' && 'Notification Settings'}
                {activeTab === 'data' && 'Data & Privacy Settings'}
                {activeTab === 'general' && 'General Settings'}
              </h3>
            </div>
            
            {activeTab === 'appearance' && renderAppearanceSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'data' && renderDataSettings()}
            {activeTab === 'general' && renderGeneralSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};