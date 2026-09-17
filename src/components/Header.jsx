import React from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';

export const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/timetable': return 'Timetable';
      case '/attendance': return 'Attendance Manager';
      case '/expenses': return 'Expense Tracker';
      case '/tasks': return 'Task Organizer';
      case '/settings': return 'Settings';
      default: return 'CampusFlow';
    }
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700 h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 hidden md:block">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
        {format(new Date(), 'EEEE, dd MMM yyyy')}
      </div>
    </header>
  );
};
