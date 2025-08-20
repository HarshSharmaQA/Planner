import React from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useThemeStore } from '../store/themeStore';

export const Dashboard: React.FC = () => {
  const { getDashboardStats } = useTaskStore();
  const { darkMode } = useThemeStore();
  const stats = getDashboardStats();

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckCircle2,
      color: 'blue',
      bgColor: darkMode ? 'bg-blue-900/20' : 'bg-blue-50',
      iconColor: 'text-blue-500',
      change: null
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: Target,
      color: 'green',
      bgColor: darkMode ? 'bg-green-900/20' : 'bg-green-50',
      iconColor: 'text-green-500',
      change: stats.totalTasks > 0 ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%` : '0%'
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks,
      icon: AlertTriangle,
      color: 'red',
      bgColor: darkMode ? 'bg-red-900/20' : 'bg-red-50',
      iconColor: 'text-red-500',
      change: null
    },
    {
      title: 'Today',
      value: stats.todayTasks,
      icon: Calendar,
      color: 'purple',
      bgColor: darkMode ? 'bg-purple-900/20' : 'bg-purple-50',
      iconColor: 'text-purple-500',
      change: null
    },
    {
      title: 'This Week',
      value: stats.thisWeekTasks,
      icon: Clock,
      color: 'orange',
      bgColor: darkMode ? 'bg-orange-900/20' : 'bg-orange-50',
      iconColor: 'text-orange-500',
      change: null
    },
    {
      title: 'Productivity Score',
      value: `${stats.productivityScore}%`,
      icon: TrendingUp,
      color: 'indigo',
      bgColor: darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50',
      iconColor: 'text-indigo-500',
      change: stats.productivityScore >= 80 ? 'Excellent' : stats.productivityScore >= 60 ? 'Good' : 'Needs Work'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Dashboard
        </h2>
        <span className={`text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/25'
                  : 'bg-white border-gray-200 hover:shadow-gray-200/50'
              } ${card.bgColor}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                {card.change && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    card.change === 'Excellent' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : card.change === 'Good'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {card.change}
                  </span>
                )}
              </div>
              
              <div>
                <p className={`text-2xl font-bold mb-1 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {card.value}
                </p>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {card.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className={`p-6 rounded-xl border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className={`w-5 h-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <h3 className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Tasks by Category
            </h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown).map(([category, count]) => {
              const percentage = stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0;
              return (
                <div key={category} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {category}
                      </span>
                      <span className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {count} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Progress */}
        <div className={`p-6 rounded-xl border ${
          darkMode 
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className={`w-5 h-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <h3 className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Weekly Progress
            </h3>
          </div>
          
          <div className="space-y-4">
            {stats.weeklyProgress.map((day, index) => {
              const maxValue = Math.max(...stats.weeklyProgress.map(d => Math.max(d.completed, d.created)));
              const completedPercentage = maxValue > 0 ? (day.completed / maxValue) * 100 : 0;
              const createdPercentage = maxValue > 0 ? (day.created / maxValue) * 100 : 0;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className={`${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        +{day.completed}
                      </span>
                      <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {day.created} new
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1 h-2">
                    <div
                      className="bg-green-500 rounded-sm transition-all duration-500"
                      style={{ width: `${completedPercentage}%` }}
                    />
                    <div
                      className="bg-blue-500 rounded-sm transition-all duration-500"
                      style={{ width: `${createdPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className={`p-6 rounded-xl border ${
        darkMode 
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Tasks by Priority
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(stats.priorityBreakdown).map(([priority, count]) => (
            <div
              key={priority}
              className={`p-4 rounded-lg text-center transition-all duration-300 hover:scale-105 ${
                darkMode ? 'bg-gray-750' : 'bg-gray-50'
              }`}
            >
              <div className={`text-2xl font-bold mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {count}
              </div>
              <div className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {priority}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};