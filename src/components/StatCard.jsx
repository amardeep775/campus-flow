import React from 'react';

export const StatCard = ({ title, value, icon, subtitle, colorClass }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div className="mb-1">
        <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</span>
      </div>
      {subtitle && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  );
};
