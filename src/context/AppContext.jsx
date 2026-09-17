import React, { createContext, useState, useEffect, useContext } from 'react';
import { loadData, saveData, initializeApp } from '../utils/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => loadData('campusflow_profile', {}));
  const [subjects, setSubjects] = useState(() => loadData('campusflow_subjects', []));
  const [classes, setClasses] = useState(() => loadData('campusflow_classes', []));
  const [expenses, setExpenses] = useState(() => loadData('campusflow_expenses', []));
  const [tasks, setTasks] = useState(() => loadData('campusflow_tasks', []));

  useEffect(() => {
    initializeApp();
    setProfile(loadData('campusflow_profile', {}));
    setSubjects(loadData('campusflow_subjects', []));
    setClasses(loadData('campusflow_classes', []));
    setExpenses(loadData('campusflow_expenses', []));
    setTasks(loadData('campusflow_tasks', []));
  }, []);

  // Sync to localStorage when state changes
  useEffect(() => { saveData('campusflow_profile', profile); }, [profile]);
  useEffect(() => { saveData('campusflow_subjects', subjects); }, [subjects]);
  useEffect(() => { saveData('campusflow_classes', classes); }, [classes]);
  useEffect(() => { saveData('campusflow_expenses', expenses); }, [expenses]);
  useEffect(() => { saveData('campusflow_tasks', tasks); }, [tasks]);

  // Profile Actions
  const updateProfile = (updates) => setProfile(prev => ({ ...prev, ...updates }));

  // Subject/Attendance Actions
  const addSubject = (subject) => setSubjects(prev => [...prev, subject]);
  const deleteSubject = (id) => setSubjects(prev => prev.filter(s => s.id !== id));
  const markAttendance = (id, isPresent) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          totalClasses: s.totalClasses + 1,
          attended: isPresent ? s.attended + 1 : s.attended
        };
      }
      return s;
    }));
  };

  // Class Actions
  const addClass = (cls) => setClasses(prev => [...prev, cls]);
  const updateClass = (id, updates) => setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const deleteClass = (id) => setClasses(prev => prev.filter(c => c.id !== id));

  // Expense Actions
  const addExpense = (expense) => setExpenses(prev => [...prev, expense]);
  const deleteExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id));

  // Task Actions
  const addTask = (task) => setTasks(prev => [...prev, task]);
  const updateTask = (id, updates) => setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const moveTask = (id, newStatus) => updateTask(id, { status: newStatus });

  // Reset Data
  const resetData = () => {
    localStorage.clear();
    initializeApp();
    window.location.reload();
  };

  return (
    <AppContext.Provider value={{
      profile, updateProfile,
      subjects, addSubject, deleteSubject, markAttendance,
      classes, addClass, updateClass, deleteClass,
      expenses, addExpense, deleteExpense,
      tasks, addTask, updateTask, deleteTask, moveTask,
      resetData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
