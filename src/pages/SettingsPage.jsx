import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { User, Shield, Wallet, Monitor, Trash2, AlertTriangle } from 'lucide-react';

export const SettingsPage = () => {
  const { profile, updateProfile, resetData } = useAppContext();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: profile?.name || 'Student',
    college: profile?.college || '',
    semester: profile?.semester || '1',
    minAttendance: profile?.minAttendance || 75,
    monthlyBudget: profile?.monthlyBudget || 10000,
    theme: profile?.theme || 'light'
  });

  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    addToast('Settings saved successfully');
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your profile and preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-3">
            <User size={20} className="text-blue-500" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Profile Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Student Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">College Name</label>
              <input type="text" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Semester</label>
              <input type="text" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-3">
            <Shield size={20} className="text-green-500" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Attendance Preferences</h2>
          </div>
          <div className="p-6">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Minimum Required Attendance (%)</label>
              <div className="flex items-center gap-4">
                <input type="range" min="50" max="100" value={formData.minAttendance} onChange={e => setFormData({...formData, minAttendance: Number(e.target.value)})} className="flex-1 accent-green-600" />
                <span className="text-lg font-bold w-12 text-center bg-slate-100 dark:bg-slate-700 py-1 rounded-md">{formData.minAttendance}%</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Bunk manager will use this limit to calculate how many classes you can safely miss.</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-3">
            <Wallet size={20} className="text-orange-500" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Financial Settings</h2>
          </div>
          <div className="p-6">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Monthly Budget (₹)</label>
              <input type="number" min="0" value={formData.monthlyBudget} onChange={e => setFormData({...formData, monthlyBudget: Number(e.target.value)})} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" required />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-3">
            <Monitor size={20} className="text-purple-500" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Appearance</h2>
          </div>
          <div className="p-6">
            <div className="flex gap-4">
              <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center gap-3 ${formData.theme === 'light' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                <input type="radio" name="theme" value="light" checked={formData.theme === 'light'} onChange={() => setFormData({...formData, theme: 'light'})} className="sr-only" />
                <div className="w-16 h-12 bg-white border border-slate-200 rounded-md shadow-sm"></div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Light Mode</span>
              </label>
              <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center gap-3 ${formData.theme === 'dark' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                <input type="radio" name="theme" value="dark" checked={formData.theme === 'dark'} onChange={() => setFormData({...formData, theme: 'dark'})} className="sr-only" />
                <div className="w-16 h-12 bg-slate-900 border border-slate-700 rounded-md shadow-sm"></div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm">
            Save All Settings
          </button>
        </div>
      </form>

      <div className="mt-12 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-xl p-6">
        <h3 className="text-red-800 dark:text-red-400 font-semibold flex items-center gap-2 mb-2">
          <AlertTriangle size={20} />
          Danger Zone
        </h3>
        <p className="text-red-600 dark:text-red-300/80 text-sm mb-4">
          This will permanently delete all your data including timetable, attendance, expenses, and tasks. It will then restore the app to its initial state with sample data.
        </p>
        
        {showConfirmReset ? (
          <div className="flex items-center gap-4 bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-red-200 dark:border-red-900/50">
            <span className="text-sm font-medium text-red-800 dark:text-red-400">Are you absolutely sure?</span>
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setShowConfirmReset(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={resetData} className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg flex items-center gap-2">
                <Trash2 size={16} /> Yes, delete everything
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowConfirmReset(true)} className="px-4 py-2 text-sm border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors flex items-center gap-2">
            <Trash2 size={16} /> Delete Data & Reset App
          </button>
        )}
      </div>
    </div>
  );
};
