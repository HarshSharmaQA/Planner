export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  attachments?: string[];
  subtasks?: SubTask[];
  assignee?: string; // TeamMember ID
  progress: number; // 0-100
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Priority {
  id: string;
  name: string;
  color: string;
  level: number; // 1-5, 5 being highest
}

export interface TaskStatus {
  id: string;
  name: string;
  color: string;
}

export interface FilterOptions {
  categories: string[];
  priorities: string[];
  statuses: string[];
  dateRange: DateRange | null;
  sortBy: SortOption;
  sortOrder: 'asc' | 'desc';
  tags?: string[];
  assignee?: string;
  hasSubtasks?: boolean;
  isOverdue?: boolean;
}

export interface DateRange {
  start: string;
  end: string;
}

export type SortOption = 'dueDate' | 'createdAt' | 'priority' | 'title' | 'progress';

export type ViewMode = 'dashboard' | 'tasks' | 'calendar' | 'analytics' | 'team' | 'settings';

export type CalendarViewMode = 'month' | 'week' | 'day';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  department?: string;
  avatar?: string;
  joinedDate: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  todayTasks: number;
  thisWeekTasks: number;
  averageCompletionTime: number;
  productivityScore: number;
  categoryBreakdown: { [key: string]: number };
  priorityBreakdown: { [key: string]: number };
  weeklyProgress: { date: string; completed: number; created: number }[];
}
