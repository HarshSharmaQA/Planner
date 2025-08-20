import { Task, FilterOptions, SortOption } from '../types';

export const filterTasks = (
  tasks: Task[],
  searchQuery: string,
  filters: FilterOptions
): Task[] => {
  let filtered = [...tasks];

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.tags.some(tag => tag.toLowerCase().includes(query)) ||
      task.category.name.toLowerCase().includes(query) ||
      task.assignee?.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (filters.categories.length > 0) {
    filtered = filtered.filter(task =>
      filters.categories.includes(task.category.id)
    );
  }

  // Priority filter
  if (filters.priorities.length > 0) {
    filtered = filtered.filter(task =>
      filters.priorities.includes(task.priority.id)
    );
  }

  // Status filter
  if (filters.statuses.length > 0) {
    filtered = filtered.filter(task =>
      filters.statuses.includes(task.status.id)
    );
  }

  // Date range filter
  if (filters.dateRange?.start && filters.dateRange?.end) {
    const startDate = new Date(filters.dateRange.start);
    const endDate = new Date(filters.dateRange.end);
    filtered = filtered.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= startDate && taskDate <= endDate;
    });
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(task =>
      filters.tags!.some(tag => task.tags.includes(tag))
    );
  }

  // Assignee filter
  if (filters.assignee) {
    filtered = filtered.filter(task =>
      task.assignee?.toLowerCase().includes(filters.assignee!.toLowerCase())
    );
  }

  // Has subtasks filter
  if (filters.hasSubtasks !== undefined) {
    filtered = filtered.filter(task =>
      filters.hasSubtasks 
        ? task.subtasks && task.subtasks.length > 0
        : !task.subtasks || task.subtasks.length === 0
    );
  }

  // Overdue filter
  if (filters.isOverdue !== undefined) {
    const now = new Date();
    filtered = filtered.filter(task => {
      const isOverdue = new Date(task.dueDate) < now && task.status.name !== 'Completed';
      return filters.isOverdue ? isOverdue : !isOverdue;
    });
  }

  return filtered;
};

export const sortTasks = (
  tasks: Task[],
  sortBy: SortOption,
  sortOrder: 'asc' | 'desc'
): Task[] => {
  const sorted = [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'priority':
        comparison = b.priority.level - a.priority.level; // Higher priority first
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'progress':
        comparison = a.progress - b.progress;
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
};