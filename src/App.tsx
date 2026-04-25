import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { Dashboard } from './components/dashboard/Dashboard';
import { AuthForm } from './components/auth/AuthForm';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-primary rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Hustle Smart</h1>
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Syncing your productivity...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {user ? (
        <TaskProvider>
          <Dashboard />
        </TaskProvider>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <AuthForm />
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

