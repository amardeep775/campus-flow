import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Plus, Trash2, Wallet, PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format, isThisMonth, isToday, isThisWeek } from 'date-fns';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const CATEGORIES = ['Food', 'Travel', 'Books', 'Shopping', 'Entertainment', 'College', 'Other'];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export const ExpensesPage = () => {
  const { profile, expenses, addExpense, deleteExpense } = useAppContext();
  const { addToast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('month'); // today, week, month, all
  
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'Food',
    description: '',
  });

  const budget = profile?.monthlyBudget || 10000;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newExpense.amount || isNaN(newExpense.amount) || Number(newExpense.amount) <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    if (!newExpense.description.trim()) {
      addToast('Description is required', 'error');
      return;
    }

    addExpense({
      id: uuidv4(),
      amount: Number(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description,
      date: new Date().toISOString()
    });

    setNewExpense({ amount: '', category: 'Food', description: '' });
    setShowAddForm(false);
    addToast('Expense added successfully');
  };

  const filteredExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    if (filter === 'today') return isToday(date);
    if (filter === 'week') return isThisWeek(date);
    if (filter === 'month') return isThisMonth(date);
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Only calculate remaining budget if looking at month or all time
  const showBudget = filter === 'month' || filter === 'all';
  const remainingBudget = budget - totalSpent;
  const budgetPercentage = showBudget ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const isOverBudget = showBudget && totalSpent > budget;

  const categoryData = CATEGORIES.map(cat => ({
    name: cat,
    value: filteredExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(cat => cat.value > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Expense Tracker</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your hosteller budget</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          <span>Add Expense</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
              <input 
                type="number" 
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white"
                placeholder="e.g., 150"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select 
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <input 
                type="text" 
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent dark:text-white"
                placeholder="e.g., Lunch at canteen"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
            <button type="submit" className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition-colors">Save Expense</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Summary</h2>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm px-2 py-1 border border-slate-200 dark:border-slate-600 rounded-md bg-transparent dark:text-white"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="text-slate-500 text-sm mb-1">Total Spent</div>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">₹{totalSpent}</div>
              </div>
              {showBudget && (
                <div className={`p-4 rounded-lg ${isOverBudget ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                  <div className={`text-sm mb-1 ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}>Remaining Budget</div>
                  <div className={`text-3xl font-bold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                    ₹{remainingBudget > 0 ? remainingBudget : 0}
                  </div>
                </div>
              )}
            </div>

            {showBudget && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2 text-slate-600 dark:text-slate-400">
                  <span>Budget usage ({budgetPercentage.toFixed(1)}%)</span>
                  <span>₹{budget}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-blue-500'}`} 
                    style={{ width: `${budgetPercentage}%` }}
                  ></div>
                </div>
                {isOverBudget && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <TrendingDown size={14} /> You have exceeded your monthly budget!
                  </p>
                )}
              </div>
            )}

            <div className="h-64">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[CATEGORIES.indexOf(entry.name)]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `₹${value}`} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No data to display chart
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-full max-h-[600px] flex flex-col">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Transactions</h2>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Wallet size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No expenses recorded yet.</p>
                </div>
              ) : (
                filteredExpenses.map(expense => (
                  <div key={expense.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                        {expense.category[0]}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">{expense.description}</div>
                        <div className="text-xs text-slate-500">{format(new Date(expense.date), 'dd MMM yyyy')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-slate-800 dark:text-slate-100">₹{expense.amount}</div>
                      <button 
                        onClick={() => deleteExpense(expense.id)}
                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
