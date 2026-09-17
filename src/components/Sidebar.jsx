import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, ClipboardCheck, Wallet, CheckSquare, Settings, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { profile } = useAppContext();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Timetable', path: '/timetable', icon: <Calendar size={20} /> },
    { name: 'Attendance', path: '/attendance', icon: <ClipboardCheck size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <Wallet size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const toggleSidebar = () => setIsMobileOpen(!isMobileOpen);

  const sidebarClasses = `fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
    isMobileOpen ? 'translate-x-0' : '-translate-x-full'
  } md:translate-x-0 md:static md:inset-auto md:w-64`;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity" 
          onClick={toggleSidebar}
        ></div>
      )}

      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between h-16 px-6 border-b dark:border-slate-700">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">CampusFlow</span>
          <button onClick={toggleSidebar} className="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-100'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t dark:border-slate-700">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile?.name || 'Student'}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Semester {profile?.semester || '1'}
            </p>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-3 italic">
              "Stay focused, stay ahead."
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
