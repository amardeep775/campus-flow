import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { calculateAttendance, calculateClassesToMiss, calculateClassesToAttend, getAttendanceStatus } from '../utils/attendance';
import { Plus, Check, X, AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const AttendancePage = () => {
  const { profile, subjects, addSubject, markAttendance, deleteSubject } = useAppContext();
  const { addToast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  const requiredPercentage = profile?.minAttendance || 75;

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      addToast('Subject name cannot be empty', 'error');
      return;
    }
    addSubject({ id: uuidv4(), name: newSubject, totalClasses: 0, attended: 0 });
    setNewSubject('');
    setShowAddForm(false);
    addToast('Subject added successfully');
  };

  const handleMark = (id, isPresent) => {
    markAttendance(id, isPresent);
    addToast(isPresent ? 'Marked Present' : 'Marked Absent');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Attendance & Bunk Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Required: {requiredPercentage}%</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Subject</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubject} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex gap-4 items-end animate-in slide-in-from-top-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Name</label>
            <input 
              type="text" 
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white"
              placeholder="e.g., Data Structures"
              autoFocus
            />
          </div>
          <button type="submit" className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition-colors">
            Save
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjects.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <ShieldCheck size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">No subjects added. Create your first subject to track attendance.</p>
          </div>
        ) : (
          subjects.map((subject) => {
            const percentage = calculateAttendance(subject.attended, subject.totalClasses);
            const status = getAttendanceStatus(percentage, requiredPercentage);
            const canMiss = calculateClassesToMiss(subject.attended, subject.totalClasses, requiredPercentage);
            const needAttend = calculateClassesToAttend(subject.attended, subject.totalClasses, requiredPercentage);

            return (
              <div key={subject.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 relative group">
                <button 
                  onClick={() => deleteSubject(subject.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
                
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 pr-6">{subject.name}</h3>
                
                <div className="flex justify-between items-end mb-2">
                  <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    {percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 text-right">
                    {subject.attended} / {subject.totalClasses} Classes
                    <div className="text-xs mt-1">Missed: {subject.totalClasses - subject.attended}</div>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-6 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-1000 ${
                      status === 'safe' ? 'bg-green-500' : status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>

                <div className="flex gap-3 mb-6">
                  <button 
                    onClick={() => handleMark(subject.id, true)}
                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={18} /> Present
                  </button>
                  <button 
                    onClick={() => handleMark(subject.id, false)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={18} /> Absent
                  </button>
                </div>

                <div className={`p-3 rounded-lg flex items-start gap-3 text-sm ${
                  status === 'safe' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                  status === 'warning' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' :
                  'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  {status === 'safe' && <ShieldCheck size={18} className="shrink-0 mt-0.5" />}
                  {status === 'warning' && <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
                  {status === 'critical' && <AlertCircle size={18} className="shrink-0 mt-0.5" />}
                  
                  <div>
                    {status === 'safe' && (
                      <span>You can safely skip the next <strong>{canMiss}</strong> {canMiss === 1 ? 'class' : 'classes'} and stay above {requiredPercentage}%.</span>
                    )}
                    {status === 'warning' && canMiss > 0 && (
                      <span>Warning! You can only miss <strong>{canMiss}</strong> more {canMiss === 1 ? 'class' : 'classes'}.</span>
                    )}
                    {status === 'warning' && canMiss === 0 && (
                      <span>On the edge! Missing the next class will drop you below {requiredPercentage}%.</span>
                    )}
                    {status === 'critical' && (
                      <span>Critical! You need to attend the next <strong>{needAttend}</strong> {needAttend === 1 ? 'class' : 'classes'} to reach {requiredPercentage}%.</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
