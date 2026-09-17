import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Plus, Trash2, Edit2, Copy } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const COLORS = [
  { name: 'Blue', value: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300' },
  { name: 'Green', value: 'bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300' },
  { name: 'Purple', value: 'bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300' },
  { name: 'Red', value: 'bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300' },
  { name: 'Orange', value: 'bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300' },
  { name: 'Yellow', value: 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300' },
];

export const TimetablePage = () => {
  const { classes, addClass, updateClass, deleteClass } = useAppContext();
  const { addToast } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    subject: '', teacher: '', room: '', startTime: '09:00', endTime: '10:00', day: 'Monday', color: COLORS[0].value
  });

  const handleOpenForm = (cls = null) => {
    if (cls) {
      setFormData(cls);
      setEditingId(cls.id);
    } else {
      setFormData({ subject: '', teacher: '', room: '', startTime: '09:00', endTime: '10:00', day: 'Monday', color: COLORS[0].value });
      setEditingId(null);
    }
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      addToast('Subject is required', 'error');
      return;
    }
    if (formData.startTime >= formData.endTime) {
      addToast('End time must be after start time', 'error');
      return;
    }

    if (editingId) {
      updateClass(editingId, formData);
      addToast('Class updated successfully');
    } else {
      addClass({ ...formData, id: uuidv4() });
      addToast('Class added successfully');
    }
    setShowForm(false);
  };

  const handleDuplicate = (cls) => {
    addClass({ ...cls, id: uuidv4() });
    addToast('Class duplicated');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Timetable</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your weekly class schedule</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          <span>Add Class</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teacher</label>
              <input type="text" value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room</label>
              <input type="text" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Day</label>
              <select value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white">
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start</label>
                <input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End</label>
                <input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Color</label>
              <div className="flex gap-2 mt-2">
                {COLORS.map(c => (
                  <button type="button" key={c.name} onClick={() => setFormData({...formData, color: c.value})} className={`w-8 h-8 rounded-full border-2 ${c.value.split(' ')[0]} ${formData.color === c.value ? 'ring-2 ring-offset-2 ring-blue-500' : 'border-transparent'}`} title={c.name} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
            <button type="submit" className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition-colors">Save Class</button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px] grid grid-cols-8 divide-x divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700">
            <div className="p-4 font-semibold text-slate-500 text-center bg-slate-50 dark:bg-slate-800/50">Time</div>
            {DAYS.map(day => (
              <div key={day} className={`p-4 font-semibold text-center ${day === new Date().toLocaleDateString('en-US', { weekday: 'long' }) ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50'}`}>
                {day.substring(0, 3)}
              </div>
            ))}
          </div>

          <div className="min-w-[800px] relative min-h-[600px] grid grid-cols-8 divide-x divide-slate-200 dark:divide-slate-700 bg-slate-50/30 dark:bg-slate-900/30">
            <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="h-16 text-xs text-slate-400 text-right pr-2 pt-1 border-slate-200 dark:border-slate-700/50">
                  {i + 8}:00
                </div>
              ))}
            </div>

            {DAYS.map((day, dayIndex) => (
              <div key={day} className="relative w-full h-full">
                {classes.filter(c => c.day === day).map(cls => {
                  const [sH, sM] = cls.startTime.split(':').map(Number);
                  const [eH, eM] = cls.endTime.split(':').map(Number);
                  
                  const startMinutes = (sH - 8) * 60 + sM;
                  const durationMinutes = (eH - sH) * 60 + (eM - sM);
                  
                  const top = (startMinutes / 60) * 4; // 4rem (64px) per hour
                  const height = (durationMinutes / 60) * 4;

                  return (
                    <div 
                      key={cls.id} 
                      className={`absolute left-1 right-1 rounded-lg border p-2 shadow-sm text-xs group overflow-hidden ${cls.color}`}
                      style={{ top: `${top}rem`, height: `${height}rem`, minHeight: '3rem' }}
                    >
                      <div className="font-bold truncate">{cls.subject}</div>
                      <div className="opacity-80 truncate">{cls.startTime} - {cls.endTime}</div>
                      {height >= 4 && (
                        <>
                          <div className="opacity-80 truncate mt-1">{cls.room}</div>
                          <div className="opacity-80 truncate">{cls.teacher}</div>
                        </>
                      )}
                      
                      <div className="absolute top-1 right-1 hidden group-hover:flex bg-white/90 dark:bg-slate-800/90 rounded shadow-sm border border-slate-200 dark:border-slate-700">
                        <button onClick={() => handleOpenForm(cls)} className="p-1 text-slate-500 hover:text-blue-500"><Edit2 size={12} /></button>
                        <button onClick={() => handleDuplicate(cls)} className="p-1 text-slate-500 hover:text-green-500"><Copy size={12} /></button>
                        <button onClick={() => deleteClass(cls.id)} className="p-1 text-slate-500 hover:text-red-500"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
