import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Filter, SlidersHorizontal, Calendar, Tag } from 'lucide-react';

interface FilterPanelProps {
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ className = '' }) => {
  const { filters, setFilters } = useTaskStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (status: string) => {
    setFilters({ ...filters, status: status === filters.status ? '' : status });
  };

  const handlePriorityChange = (priority: string) => {
    setFilters({ ...filters, priority: priority === filters.priority ? '' : priority });
  };

  const handleDateFilterChange = (dateFilter: string) => {
    setFilters({ ...filters, dateFilter: dateFilter === filters.dateFilter ? '' : dateFilter });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-blue-500" />
          <h3 className="font-medium text-gray-800 dark:text-gray-200">Filters</h3>
        </div>
        <button
          onClick={toggleExpand}
          className="text-gray-500 hover:text-blue-500 transition-colors"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag size={16} className="text-blue-500" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['To Do', 'In Progress', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${filters.status === status
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter size={16} className="text-blue-500" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Low', 'Medium', 'High'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => handlePriorityChange(priority)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${filters.priority === priority
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-blue-500" />
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Today', 'This Week', 'This Month'].map((dateFilter) => (
                <button
                  key={dateFilter}
                  onClick={() => handleDateFilterChange(dateFilter)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${filters.dateFilter === dateFilter
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  {dateFilter}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;