import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppContext } from '../context/AppContext';

export const Layout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { profile } = useAppContext();

  useEffect(() => {
    if (profile?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile?.theme]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsMobileOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 md:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
