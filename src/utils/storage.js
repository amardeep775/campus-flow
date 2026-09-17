import { v4 as uuidv4 } from 'uuid';

export const loadData = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Initial Sample Data
export const INITIAL_PROFILE = {
  name: 'Student',
  college: 'My College',
  semester: '1',
  minAttendance: 75,
  monthlyBudget: 10000,
  theme: 'light',
};

export const INITIAL_SUBJECTS = [
  { id: '1', name: 'Data Structures', totalClasses: 30, attended: 25 }, // 83.33%
  { id: '2', name: 'Operating Systems', totalClasses: 20, attended: 14 }, // 70%
  { id: '3', name: 'DBMS', totalClasses: 25, attended: 20 }, // 80%
  { id: '4', name: 'Mathematics', totalClasses: 30, attended: 30 }, // 100%
  { id: '5', name: 'Computer Networks', totalClasses: 22, attended: 17 }, // 77.27%
];

export const INITIAL_CLASSES = [
  { id: uuidv4(), subject: 'Data Structures', teacher: 'Dr. Smith', room: '101', startTime: '09:00', endTime: '10:00', day: 'Monday', color: 'bg-blue-100' },
  { id: uuidv4(), subject: 'Operating Systems', teacher: 'Prof. Johnson', room: '102', startTime: '10:00', endTime: '11:00', day: 'Monday', color: 'bg-green-100' },
  { id: uuidv4(), subject: 'DBMS', teacher: 'Mr. Davis', room: '103', startTime: '11:00', endTime: '12:00', day: 'Tuesday', color: 'bg-purple-100' },
  { id: uuidv4(), subject: 'Mathematics', teacher: 'Dr. Wilson', room: '104', startTime: '09:00', endTime: '10:00', day: 'Wednesday', color: 'bg-red-100' },
];

export const INITIAL_EXPENSES = [
  { id: uuidv4(), amount: 120, category: 'Food', description: 'Lunch at canteen', date: new Date().toISOString() },
  { id: uuidv4(), amount: 80, category: 'Travel', description: 'Bus ticket', date: new Date().toISOString() },
  { id: uuidv4(), amount: 300, category: 'Books', description: 'Notebooks', date: new Date().toISOString() },
];

export const INITIAL_TASKS = [
  { id: uuidv4(), title: 'Complete DSA Assignment', subject: 'Data Structures', description: 'Binary trees implementation', priority: 'High', deadline: new Date(Date.now() + 86400000).toISOString(), createdAt: new Date().toISOString(), status: 'TODO' },
  { id: uuidv4(), title: 'Prepare DBMS presentation', subject: 'DBMS', description: 'Normal forms', priority: 'Medium', deadline: new Date(Date.now() + 86400000 * 2).toISOString(), createdAt: new Date().toISOString(), status: 'IN_PROGRESS' },
  { id: uuidv4(), title: 'Submit lab report', subject: 'Operating Systems', description: 'Scheduling algorithms', priority: 'Low', deadline: new Date().toISOString(), createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'DONE' },
];

export const initializeApp = () => {
  const isInitialized = loadData('campusflow_initialized', false);
  if (!isInitialized) {
    saveData('campusflow_profile', INITIAL_PROFILE);
    saveData('campusflow_subjects', INITIAL_SUBJECTS);
    saveData('campusflow_classes', INITIAL_CLASSES);
    saveData('campusflow_expenses', INITIAL_EXPENSES);
    saveData('campusflow_tasks', INITIAL_TASKS);
    saveData('campusflow_initialized', true);
  }
};
