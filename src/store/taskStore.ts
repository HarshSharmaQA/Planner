import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Category, Priority, TaskStatus, DashboardStats, TeamMember } from '../types';
import { generateId } from '../utils/helpers';

interface Filters {
  status: string;
  priority: string;
  dateFilter: string;
  searchQuery?: string;
  categoryId?: string;
}

interface TaskStore {
  tasks: Task[];
  categories: Category[];
  priorities: Priority[];
  statuses: TaskStatus[];
  teamMembers: TeamMember[];
  filters: Filters;
  setFilters: (filters: Partial<Filters>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'joinedDate'>) => void;
  updateTeamMember: (id: string, updates: Partial<Omit<TeamMember, 'id' | 'joinedDate'>>) => void;
  deleteTeamMember: (id: string) => void;
  getTasksByCategory: (categoryId: string) => Task[];
  getTasksByStatus: (statusId: string) => Task[];
  getOverdueTasks: () => Task[];
  getTodayTasks: () => Task[];
  getThisWeekTasks: () => Task[];
  getDashboardStats: () => DashboardStats;
  initializeData: () => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Work', color: '#3B82F6', icon: 'briefcase' },
  { id: '2', name: 'Personal', color: '#8B5CF6', icon: 'user' },
  { id: '3', name: 'Health', color: '#10B981', icon: 'heart' },
  { id: '4', name: 'Learning', color: '#F59E0B', icon: 'book' },
  { id: '5', name: 'Finance', color: '#EF4444', icon: 'dollar-sign' }
];

const defaultPriorities: Priority[] = [
  { id: '1', name: 'Very Low', color: '#6B7280', level: 1 },
  { id: '2', name: 'Low', color: '#10B981', level: 2 },
  { id: '3', name: 'Medium', color: '#F59E0B', level: 3 },
  { id: '4', name: 'High', color: '#EF4444', level: 4 },
  { id: '5', name: 'Critical', color: '#DC2626', level: 5 }
];

const defaultStatuses: TaskStatus[] = [
  { id: '1', name: 'Not Started', color: '#6B7280' },
  { id: '2', name: 'In Progress', color: '#3B82F6' },
  { id: '3', name: 'Review', color: '#F59E0B' },
  { id: '4', name: 'Completed', color: '#10B981' },
  { id: '5', name: 'Cancelled', color: '#EF4444' }
];

const defaultTeamMembers: Omit<TeamMember, 'id' | 'joinedDate'>[] = [
  {
    name: 'Sarah Johnson',
    role: 'Project Manager',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0123',
    department: 'Management',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Michael Chen',
    role: 'Senior Developer',
    email: 'michael.chen@company.com',
    phone: '+1-555-0124',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Designer',
    email: 'emily.rodriguez@company.com',
    phone: '+1-555-0125',
    department: 'Design',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  }
];

const sampleTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Complete quarterly report',
    description: 'Prepare and submit Q4 financial report to stakeholders',
    category: defaultCategories[0],
    priority: defaultPriorities[3],
    status: defaultStatuses[1],
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['finance', 'quarterly', 'stakeholders'],
    estimatedTime: 240,
    actualTime: 180,
    progress: 65,
    assignee: '',
    subtasks: [
      { id: generateId(), title: 'Gather financial data', completed: true, createdAt: new Date().toISOString() },
      { id: generateId(), title: 'Analyze trends', completed: true, createdAt: new Date().toISOString() },
      { id: generateId(), title: 'Create visualizations', completed: false, createdAt: new Date().toISOString() },
      { id: generateId(), title: 'Write executive summary', completed: false, createdAt: new Date().toISOString() }
    ]
  },
  {
    title: 'Morning workout routine',
    description: 'Daily 45-minute workout including cardio and strength training',
    category: defaultCategories[2],
    priority: defaultPriorities[2],
    status: defaultStatuses[0],
    dueDate: new Date().toISOString(),
    tags: ['fitness', 'daily', 'health'],
    estimatedTime: 45,
    progress: 0,
    assignee: ''
  },
  {
    title: 'Learn React Advanced Patterns',
    description: 'Study advanced React patterns including hooks, context, and performance optimization',
    category: defaultCategories[3],
    priority: defaultPriorities[2],
    status: defaultStatuses[1],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['react', 'programming', 'learning'],
    estimatedTime: 300,
    actualTime: 120,
    progress: 40,
    assignee: ''
  },
  {
    title: 'Plan weekend trip',
    description: 'Research and book accommodations for weekend getaway',
    category: defaultCategories[1],
    priority: defaultPriorities[1],
    status: defaultStatuses[0],
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['travel', 'planning', 'weekend'],
    estimatedTime: 90,
    progress: 10,
    assignee: ''
  },
  {
    title: 'Review investment portfolio',
    description: 'Quarterly review of investment performance and rebalancing',
    category: defaultCategories[4],
    priority: defaultPriorities[3],
    status: defaultStatuses[2],
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['investments', 'quarterly', 'finance'],
    estimatedTime: 120,
    actualTime: 90,
    progress: 85,
    assignee: ''
  }
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: defaultCategories,
      priorities: defaultPriorities,
      statuses: defaultStatuses,
      teamMembers: defaultTeamMembers.map(member => ({
        ...member,
        id: generateId(),
        joinedDate: new Date().toISOString()
      })),
      filters: {
        status: '',
        priority: '',
        dateFilter: '',
        searchQuery: '',
        categoryId: ''
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters }
        }));
      },

      addTask: (taskData) => {
        const now = new Date().toISOString();
        const newTask: Task = {
          ...taskData,
          id: generateId(),
          createdAt: now,
          updatedAt: now
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          )
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        }));
      },

      toggleTaskStatus: (id) => {
        const { tasks, statuses } = get();
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const completedStatus = statuses.find(s => s.name === 'Completed');
        const inProgressStatus = statuses.find(s => s.name === 'In Progress');
        
        if (!completedStatus || !inProgressStatus) return;

        const newStatus = task.status.name === 'Completed' ? inProgressStatus : completedStatus;
        const newProgress = newStatus.name === 'Completed' ? 100 : task.progress;

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { 
                  ...t, 
                  status: newStatus, 
                  progress: newProgress,
                  updatedAt: new Date().toISOString()
                }
              : t
          )
        }));
      },

      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: generateId()
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          )
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id)
        }));
      },

      addTeamMember: (memberData) => {
        const now = new Date().toISOString();
        const newMember: TeamMember = {
          ...memberData,
          id: generateId(),
          joinedDate: now
        };
        set((state) => ({ teamMembers: [...state.teamMembers, newMember] }));
      },

      updateTeamMember: (id, updates) => {
        set((state) => ({
          teamMembers: state.teamMembers.map((member) =>
            member.id === id
              ? { ...member, ...updates }
              : member
          )
        }));
      },

      deleteTeamMember: (id) => {
        set((state) => ({
          teamMembers: state.teamMembers.filter((member) => member.id !== id)
        }));
      },

      getTasksByCategory: (categoryId) => {
        const { tasks } = get();
        return tasks.filter(task => task.category.id === categoryId);
      },

      getTasksByStatus: (statusId) => {
        const { tasks } = get();
        return tasks.filter(task => task.status.id === statusId);
      },

      getOverdueTasks: () => {
        const { tasks } = get();
        const now = new Date();
        return tasks.filter(task => 
          new Date(task.dueDate) < now && task.status.name !== 'Completed'
        );
      },

      getTodayTasks: () => {
        const { tasks } = get();
        const today = new Date().toDateString();
        return tasks.filter(task => 
          new Date(task.dueDate).toDateString() === today
        );
      },

      getThisWeekTasks: () => {
        const { tasks } = get();
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        return tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate >= weekStart && dueDate <= weekEnd;
        });
      },

      getDashboardStats: () => {
        const { tasks, categories, priorities } = get();
        const completedTasks = tasks.filter(t => t.status.name === 'Completed');
        const overdueTasks = get().getOverdueTasks();
        const todayTasks = get().getTodayTasks();
        const thisWeekTasks = get().getThisWeekTasks();

        const categoryBreakdown = categories.reduce((acc, cat) => {
          acc[cat.name] = tasks.filter(t => t.category.id === cat.id).length;
          return acc;
        }, {} as { [key: string]: number });

        const priorityBreakdown = priorities.reduce((acc, priority) => {
          acc[priority.name] = tasks.filter(t => t.priority.id === priority.id).length;
          return acc;
        }, {} as { [key: string]: number });

        const avgTime = completedTasks.reduce((sum, task) => 
          sum + (task.actualTime || task.estimatedTime || 0), 0
        ) / (completedTasks.length || 1);

        const productivityScore = Math.min(100, Math.round(
          (completedTasks.length / (tasks.length || 1)) * 100 * 
          (1 - overdueTasks.length / (tasks.length || 1))
        ));

        const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          return {
            date: dateStr,
            completed: completedTasks.filter(t => 
              t.updatedAt.startsWith(dateStr) && t.status.name === 'Completed'
            ).length,
            created: tasks.filter(t => t.createdAt.startsWith(dateStr)).length
          };
        }).reverse();

        return {
          totalTasks: tasks.length,
          completedTasks: completedTasks.length,
          overdueTasks: overdueTasks.length,
          todayTasks: todayTasks.length,
          thisWeekTasks: thisWeekTasks.length,
          averageCompletionTime: avgTime,
          productivityScore,
          categoryBreakdown,
          priorityBreakdown,
          weeklyProgress
        };
      },

      initializeData: () => {
        const { tasks } = get();
        if (tasks.length === 0) {
          const initialTasks = sampleTasks.map(taskData => {
            const now = new Date().toISOString();
            return {
              ...taskData,
              id: generateId(),
              createdAt: now,
              updatedAt: now
            };
          });
          set({ tasks: initialTasks });
        }
      }
    }),
    {
      name: 'zz-planner-storage',
      version: 1
    }
  )
);
