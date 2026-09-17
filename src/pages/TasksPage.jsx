import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Plus, Trash2, Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format, isPast, isToday } from 'date-fns';

export const TasksPage = () => {
  const { tasks, addTask, updateTask, deleteTask, moveTask, subjects } = useAppContext();
  const { addToast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    description: '',
    priority: 'Medium',
    deadline: format(new Date(), 'yyyy-MM-dd')
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      addToast('Task title is required', 'error');
      return;
    }

    addTask({
      id: uuidv4(),
      ...newTask,
      createdAt: new Date().toISOString(),
      status: 'TODO'
    });

    setNewTask({ title: '', subject: '', description: '', priority: 'Medium', deadline: format(new Date(), 'yyyy-MM-dd') });
    setShowAddForm(false);
    addToast('Task added successfully');
  };

  const columns = [
    { id: 'TODO', title: 'TO DO', color: 'bg-slate-200 dark:bg-slate-700' },
    { id: 'IN_PROGRESS', title: 'IN PROGRESS', color: 'bg-blue-200 dark:bg-blue-900/50' },
    { id: 'DONE', title: 'DONE', color: 'bg-green-200 dark:bg-green-900/50' }
  ];

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
    if (priority === 'Medium') return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
    return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
  };

  const getDeadlineStatus = (deadline, status) => {
    if (status === 'DONE') return null;
    const date = new Date(deadline);
    if (isPast(date) && !isToday(date)) return <span className="text-red-500 font-medium text-xs">Overdue</span>;
    if (isToday(date)) return <span className="text-orange-500 font-medium text-xs">Due Today</span>;
    return <span className="text-slate-500 text-xs">Due {format(date, 'MMM dd')}</span>;
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Assignment & Task Organizer</h1>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
              <input 
                type="text" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white"
                placeholder="e.g., Complete DSA Assignment"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <select 
                value={newTask.subject}
                onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white"
              >
                <option value="">Select Subject (Optional)</option>
                {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deadline</label>
              <input 
                type="date" 
                value={newTask.deadline}
                onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white"
              />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <input 
                type="text" 
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
              <select 
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
            <button type="submit" className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition-colors">Save Task</button>
          </div>
        </form>
      )}

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4 min-h-[400px]">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="flex-1 min-w-[300px] flex flex-col bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className={`w-3 h-3 rounded-full ${col.color.split(' ')[0]}`}></div>
                <h3 className="font-bold text-slate-700 dark:text-slate-200">{col.title}</h3>
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-24 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center text-slate-400 text-sm">
                    No tasks
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div key={task.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 group hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {col.id !== 'TODO' && (
                            <button onClick={() => moveTask(task.id, col.id === 'DONE' ? 'IN_PROGRESS' : 'TODO')} className="p-1 text-slate-400 hover:text-blue-500" title="Move Back">
                              <ArrowRight size={14} className="rotate-180" />
                            </button>
                          )}
                          {col.id !== 'DONE' && (
                            <button onClick={() => moveTask(task.id, col.id === 'TODO' ? 'IN_PROGRESS' : 'DONE')} className="p-1 text-slate-400 hover:text-green-500" title="Move Forward">
                              <ArrowRight size={14} />
                            </button>
                          )}
                          <button onClick={() => deleteTask(task.id)} className="p-1 text-slate-400 hover:text-red-500 ml-1">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">{task.title}</h4>
                      {task.subject && <div className="text-xs text-blue-600 dark:text-blue-400 mb-2">{task.subject}</div>}
                      {task.description && <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{task.description}</p>}
                      
                      <div className="flex items-center gap-1 mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
                        <Clock size={12} className="text-slate-400" />
                        {getDeadlineStatus(task.deadline, task.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
