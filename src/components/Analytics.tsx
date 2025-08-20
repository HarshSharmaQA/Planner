import React from 'react';
import { BarChart3, PieChart, TrendingUp, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useThemeStore } from '../store/themeStore';

export const Analytics: React.FC = () => {
  const { getDashboardStats } = useTaskStore();
  const { darkMode } = useThemeStore();
  const stats = getDashboardStats();

  // Calculate additional analytics metrics
  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;
  
  const averageTaskTime = stats.completedTasks > 0 
    ? Math.round(stats.averageCompletionTime / stats.completedTasks) 
    : 0;

  const productivityTrend = stats.weeklyProgress.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    completed: day.completed,
    created: day.created,
    ratio: day.created > 0 ? Math.round((day.completed / day.created) * 100) : 0
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Analytics
        </h2>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Completion Rate */}
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Completion Rate</h3>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${completionRate >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'}`}>
              {completionRate >= 70 ? 'Good' : 'Needs Work'}
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-end justify-between">
              <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{completionRate}%</span>
              <div className="flex items-center">
                <TrendingUp className={`w-4 h-4 ${completionRate >= stats.productivityScore ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-xs ml-1 ${completionRate >= stats.productivityScore ? 'text-green-500' : 'text-red-500'}`}>
                  {completionRate >= stats.productivityScore ? '+' : '-'}{Math.abs(completionRate - stats.productivityScore)}%
                </span>
              </div>
            </div>
            <div className="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${completionRate >= 70 ? 'bg-green-500' : 'bg-orange-500'}`}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Average Task Time */}
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Clock className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
            <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Avg. Task Time</h3>
          </div>
          <div className="mt-4">
            <div className="flex items-end justify-between">
              <div>
                <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.floor(averageTaskTime / 60)}h {averageTaskTime % 60}m
                </span>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Per completed task</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
            <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Today's Tasks</h3>
          </div>
          <div className="mt-4">
            <div className="flex items-end justify-between">
              <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.todayTasks}</span>
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Completed: </span>
                  <span className={`text-xs ml-1 font-medium ${darkMode ? 'text-green-400' : 'text-green-500'}`}>
                    {stats.todayTasks > 0 ? Math.round((stats.completedTasks / stats.todayTasks) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Overdue: </span>
                  <span className={`text-xs ml-1 font-medium ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
                    {stats.overdueTasks}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className={`w-5 h-5 ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} />
            <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>This Week</h3>
          </div>
          <div className="mt-4">
            <div className="flex items-end justify-between">
              <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.thisWeekTasks}</span>
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Planned: </span>
                  <span className={`text-xs ml-1 font-medium ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                    {stats.thisWeekTasks - stats.overdueTasks}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Overdue: </span>
                  <span className={`text-xs ml-1 font-medium ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
                    {stats.overdueTasks}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution by Category */}
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Tasks by Category
            </h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(stats.categoryBreakdown).map(([category, count]) => {
              const percentage = stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0;
              return (
                <div key={category} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {category}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {count} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
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

        {/* Task Distribution by Priority */}
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Tasks by Priority
            </h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(stats.priorityBreakdown).map(([priority, count]) => {
              const percentage = stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0;
              let barColor = '';
              
              switch(priority) {
                case 'Critical':
                  barColor = 'bg-red-500';
                  break;
                case 'High':
                  barColor = 'bg-orange-500';
                  break;
                case 'Medium':
                  barColor = 'bg-yellow-500';
                  break;
                case 'Low':
                  barColor = 'bg-green-500';
                  break;
                default:
                  barColor = 'bg-gray-500';
              }
              
              return (
                <div key={priority} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {priority}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {count} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weekly Productivity Trend */}
      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Weekly Productivity Trend
          </h3>
        </div>
        
        <div className="grid grid-cols-7 gap-2 h-40">
          {productivityTrend.map((day, index) => {
            const maxValue = Math.max(...productivityTrend.map(d => Math.max(d.created, d.completed)));
            const createdHeight = maxValue > 0 ? (day.created / maxValue) * 100 : 0;
            const completedHeight = maxValue > 0 ? (day.completed / maxValue) * 100 : 0;
            
            return (
              <div key={index} className="flex flex-col items-center justify-end space-y-2">
                <div className="w-full flex justify-center space-x-1">
                  <div className="w-3 bg-blue-500 dark:bg-blue-600 rounded-t" style={{ height: `${createdHeight}%` }} />
                  <div className="w-3 bg-green-500 dark:bg-green-600 rounded-t" style={{ height: `${completedHeight}%` }} />
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{day.date}</span>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 rounded-full" />
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Created</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded-full" />
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};