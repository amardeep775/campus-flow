import React from 'react';
import { useAppContext } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { ClipboardCheck, Wallet, CheckSquare, Clock } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { calculateAttendance } from '../utils/attendance';

export const Dashboard = () => {
  const { profile, subjects, expenses, tasks, classes } = useAppContext();

  // Calculations
  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0);
  const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
  const overallAttendance = totalClasses > 0 ? calculateAttendance(totalAttended, totalClasses) : 100;

  const thisMonthExpenses = expenses.filter(e => new Date(e.date).getMonth() === new Date().getMonth());
  const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = (profile?.monthlyBudget || 10000) - totalSpent;

  const pendingTasks = tasks.filter(t => t.status !== 'DONE').length;
  const completedTasks = tasks.filter(t => t.status === 'DONE').length;

  const todayClasses = classes.filter(c => c.day === format(new Date(), 'EEEE'));

  const upcomingDeadlines = [...tasks]
    .filter(t => t.status !== 'DONE' && new Date(t.deadline) >= new Date())
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Good Morning, {profile?.name || 'Student'} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your overview for today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Attendance"
          value={`${overallAttendance.toFixed(1)}%`}
          subtitle={`${totalAttended} / ${totalClasses} Classes`}
          icon={<ClipboardCheck size={20} className="text-blue-600" />}
          colorClass="bg-blue-50 dark:bg-blue-900/50"
        />
        <StatCard
          title="Monthly Spent"
          value={`₹${totalSpent}`}
          subtitle={`Remaining: ₹${remainingBudget}`}
          icon={<Wallet size={20} className="text-green-600" />}
          colorClass="bg-green-50 dark:bg-green-900/50"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          subtitle={`${completedTasks} Completed`}
          icon={<CheckSquare size={20} className="text-purple-600" />}
          colorClass="bg-purple-50 dark:bg-purple-900/50"
        />
        <StatCard
          title="Today's Classes"
          value={todayClasses.length}
          subtitle="Check timetable below"
          icon={<Clock size={20} className="text-orange-600" />}
          colorClass="bg-orange-50 dark:bg-orange-900/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Today's Timetable</h2>
            </div>
            {todayClasses.length > 0 ? (
              <div className="space-y-4">
                {todayClasses.map(c => (
                  <div key={c.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                    <div className="text-center min-w-[80px]">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{c.startTime}</div>
                      <div className="text-xs text-slate-500">{c.endTime}</div>
                    </div>
                    <div className={`w-1 h-12 rounded-full ${c.color.replace('bg-', 'bg-').replace('-100', '-500')}`}></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100">{c.subject}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{c.teacher} • Room {c.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">No classes scheduled for today. Enjoy your day!</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">Upcoming Deadlines</h2>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-4">
                {upcomingDeadlines.map(task => (
                  <div key={task.id} className="flex flex-col gap-1 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate pr-2">{task.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        task.priority === 'Medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>{task.priority}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{task.subject}</span>
                      <span>{format(new Date(task.deadline), 'dd MMM')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">No upcoming deadlines. You're all caught up!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
