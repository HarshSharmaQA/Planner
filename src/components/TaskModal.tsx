import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useThemeStore } from '../store/themeStore';
import { Task, SubTask } from '../types';
import { generateId } from '../utils/helpers';

interface TaskModalProps {
  isOpen: boolean;
  task?: Task | null;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, task, onClose }) => {
  const { categories, priorities, statuses, teamMembers, addTask, updateTask } = useTaskStore();
  const { darkMode } = useThemeStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priorityId: '',
    statusId: '',
    dueDate: '',
    estimatedTime: '',
    progress: 0,
    tags: [] as string[],
    assignee: '',
    subtasks: [] as SubTask[]
  });
  
  const [tagInput, setTagInput] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        categoryId: task.category.id,
        priorityId: task.priority.id,
        statusId: task.status.id,
        dueDate: task.dueDate.split('T')[0],
        estimatedTime: task.estimatedTime?.toString() || '',
        progress: task.progress,
        tags: task.tags,
        assignee: task.assignee || '',
        subtasks: task.subtasks || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        categoryId: categories[0]?.id || '',
        priorityId: priorities[2]?.id || '', // Default to Medium priority
        statusId: statuses[0]?.id || '', // Default to Not Started
        dueDate: new Date().toISOString().split('T')[0],
        estimatedTime: '',
        progress: 0,
        tags: [],
        assignee: '',
        subtasks: []
      });
    }
  }, [task, categories, priorities, statuses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const category = categories.find(c => c.id === formData.categoryId);
    const priority = priorities.find(p => p.id === formData.priorityId);
    const status = statuses.find(s => s.id === formData.statusId);
    
    if (!category || !priority || !status) return;

    const taskData = {
      title: formData.title,
      description: formData.description,
      category,
      priority,
      status,
      dueDate: new Date(formData.dueDate).toISOString(),
      estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
      progress: formData.progress,
      tags: formData.tags,
      assignee: formData.assignee || undefined,
      subtasks: formData.subtasks
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addSubtask = () => {
    if (subtaskInput.trim()) {
      const newSubtask: SubTask = {
        id: generateId(),
        title: subtaskInput.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, newSubtask]
      }));
      setSubtaskInput('');
    }
  };

  const removeSubtask = (subtaskId: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== subtaskId)
    }));
  };

  const toggleSubtask = (subtaskId: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
        darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter task title..."
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter task description..."
              />
            </div>

            {/* Category, Priority, Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Category *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Priority *
                </label>
                <select
                  required
                  value={formData.priorityId}
                  onChange={(e) => setFormData(prev => ({ ...prev, priorityId: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {priorities.map(priority => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Status *
                </label>
                <select
                  required
                  value={formData.statusId}
                  onChange={(e) => setFormData(prev => ({ ...prev, statusId: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {statuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date, Time, Progress Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Estimated Time (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="60"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Progress ({formData.progress}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Assignee
              </label>
              <select
                value={formData.assignee}
                onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">No assignee</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Subtasks */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Subtasks
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSubtask();
                    }
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Add a subtask..."
                />
                <button
                  type="button"
                  onClick={addSubtask}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.subtasks.map(subtask => (
                  <div
                    key={subtask.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(subtask.id)}
                      className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                    />
                    <span className={`flex-1 text-sm ${
                      subtask.completed 
                        ? darkMode ? 'text-gray-400 line-through' : 'text-gray-500 line-through'
                        : darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {subtask.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(subtask.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-3 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                {task ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};