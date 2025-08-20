import React, { useState } from 'react';
import { Users, UserPlus, Mail, Phone, Briefcase, Calendar, CheckCircle2, Clock, Edit2, Trash2, Building } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { useThemeStore } from '../store/themeStore';
import { TeamMember } from '../types';
import { TeamMemberModal } from './TeamMemberModal';



export const Team: React.FC = () => {
  const { tasks, teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useTaskStore();
  const { darkMode } = useThemeStore();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | undefined>();

  const handleSelectMember = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleAddMember = () => {
    setEditingMember(undefined);
    setIsModalOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      deleteTeamMember(id);
      if (selectedMember?.id === id) {
        setSelectedMember(null);
      }
    }
  };

  const handleSaveMember = (memberData: Omit<TeamMember, 'id' | 'joinedDate'>) => {
    if (editingMember) {
      updateTeamMember(editingMember.id, memberData);
    } else {
      addTeamMember(memberData);
    }
  };

  const getMemberTasks = (member: TeamMember) => {
    return tasks.filter(task => task.assignee === member.id);
  };

  const getMemberStats = (member: TeamMember) => {
    const memberTasks = getMemberTasks(member);
    const completedTasks = memberTasks.filter(task => task.status.name === 'Completed').length;
    return {
      tasks: memberTasks,
      completedTasks,
      totalTasks: memberTasks.length
    };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Team
        </h2>
        <button 
          onClick={handleAddMember}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members List */}
        <div className="lg:col-span-1">
          <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Users className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Team Members ({teamMembers.length})
                </h3>
              </div>
            </div>
            
            <div className="space-y-4">
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => {
                  const stats = getMemberStats(member);
                  return (
                    <div 
                      key={member.id}
                      className={`flex items-center p-3 rounded-lg transition-colors ${selectedMember?.id === member.id ? (darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')}`}
                    >
                      <img 
                        src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff`} 
                        alt={member.name} 
                        className="w-10 h-10 rounded-full cursor-pointer"
                        onClick={() => handleSelectMember(member)}
                      />
                      <div className="ml-3 flex-1 cursor-pointer" onClick={() => handleSelectMember(member)}>
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {member.name}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {member.role}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Tasks
                          </div>
                          <div className="flex items-center justify-end space-x-1">
                            <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-500'}`}>
                              {stats.completedTasks}
                            </span>
                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>/</span>
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {stats.totalTasks}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditMember(member);
                            }}
                            className={`p-1 rounded transition-colors ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMember(member.id);
                            }}
                            className={`p-1 rounded transition-colors ${darkMode ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' : 'text-red-500 hover:text-red-600 hover:bg-gray-100'}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No team members yet</p>
                  <button
                    onClick={handleAddMember}
                    className={`mt-2 text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}
                  >
                    Add your first team member
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Member Details */}
        <div className="lg:col-span-2">
          {selectedMember ? (
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              {/* Member Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src={selectedMember.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}&background=random&color=fff`} 
                    alt={selectedMember.name} 
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedMember.name}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedMember.role}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditMember(selectedMember)}
                    className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(selectedMember.id)}
                    className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' : 'text-red-500 hover:text-red-600 hover:bg-gray-100'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Mail className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedMember.email}
                  </span>
                </div>
                <div className={`flex items-center space-x-2 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Phone className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedMember.phone}
                  </span>
                </div>
              </div>

              {selectedMember.department && (
                <div className={`flex items-center space-x-2 p-3 rounded-lg mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Building className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedMember.department}
                  </span>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                    <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Tasks</span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedMember.totalTasks}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                    <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Completed</span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedMember.completedTasks}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                    <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Due Today</span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedMember.tasks.filter(task => {
                      const today = new Date().toISOString().split('T')[0];
                      const dueDate = new Date(task.dueDate).toISOString().split('T')[0];
                      return dueDate === today;
                    }).length}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className={`w-4 h-4 ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                    <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg. Time</span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedMember.tasks.length > 0 
                      ? Math.round(selectedMember.tasks.reduce((sum, task) => sum + (task.actualTime || 0), 0) / selectedMember.tasks.length)
                      : 0} min
                  </p>
                </div>
              </div>

              {/* Tasks */}
              <div>
                <h4 className={`font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Assigned Tasks
                </h4>
                {(() => {
                  const stats = getMemberStats(selectedMember);
                  return stats.tasks.length > 0 ? (
                    <div className="space-y-3">
                      {stats.tasks.map((task) => (
                        <div 
                          key={task.id}
                          className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                        >
                          <div className="flex items-center justify-between">
                            <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {task.title}
                            </h5>
                            <span 
                              className={`px-2 py-1 text-xs rounded-full ${task.status.name === 'Completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : task.status.name === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                            >
                              {task.status.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500" 
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No tasks assigned yet
                    </p>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-xl border flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`} style={{ minHeight: '400px' }}>
              <Users className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">Select a team member to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Team Member Modal */}
      <TeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMember}
        member={editingMember}
      />
    </div>
  );
};