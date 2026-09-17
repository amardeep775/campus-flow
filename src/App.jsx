import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { TimetablePage } from './pages/TimetablePage';
import { AttendancePage } from './pages/AttendancePage';
import { ExpensesPage } from './pages/ExpensesPage';
import { TasksPage } from './pages/TasksPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
        </Router>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
