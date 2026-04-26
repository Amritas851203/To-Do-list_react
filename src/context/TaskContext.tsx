import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import type { Task } from '../types';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  productivityProgress: number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserStreak } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    // Load from localStorage for this user
    const loadTasks = () => {
      const savedTasksStr = localStorage.getItem(`tasks_${user.uid}`);
      if (savedTasksStr) {
        try {
          const parsedTasks = JSON.parse(savedTasksStr) as Task[];
          // Sort by createdAt descending
          parsedTasks.sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return timeB - timeA;
          });
          setTasks(parsedTasks);
        } catch (e) {
          console.error("Failed to parse tasks", e);
          setTasks([]);
        }
      } else {
        // First time user: Seed with professional samples
        const sampleTasks: Task[] = [
          {
            id: 'sample-1',
            userId: user.uid,
            title: 'Complete React 3D Project',
            description: 'Finalize the Three.js and Recharts integration.',
            completed: true,
            priority: 'High',
            category: 'Study',
            startTime: '09:00 AM',
            endTime: '11:30 AM',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'sample-2',
            userId: user.uid,
            title: 'Weekly Routine Planning',
            description: 'Organize the upcoming B.Tech semester schedule.',
            completed: false,
            priority: 'Medium',
            category: 'Personal',
            startTime: '02:00 PM',
            endTime: '03:00 PM',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'sample-3',
            userId: user.uid,
            title: 'Dashboard UI Review',
            description: 'Ensure the glassmorphism look is consistent.',
            completed: true,
            priority: 'Low',
            category: 'Work',
            startTime: '04:30 PM',
            endTime: '05:30 PM',
            createdAt: new Date().toISOString(),
          }
        ];
        setTasks(sampleTasks);
        localStorage.setItem(`tasks_${user.uid}`, JSON.stringify(sampleTasks));
      }
    };

    loadTasks();
  }, [user]);

  const saveTasks = (newTasks: Task[]) => {
    if (!user) return;
    setTasks(newTasks);
    localStorage.setItem(`tasks_${user.uid}`, JSON.stringify(newTasks));
  };

  const addTask = async (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    const newTasks = [newTask, ...tasks];
    saveTasks(newTasks);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (updates.completed === true) {
      updateUserStreak();
    }
    const newTasks = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    saveTasks(newTasks);
  };

  const deleteTask = async (id: string) => {
    const newTasks = tasks.filter(t => t.id !== id);
    saveTasks(newTasks);
  };

  const productivityProgress = tasks.length > 0 
    ? (tasks.filter(t => t.completed).length / tasks.length) * 100 
    : 0;

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask, 
      productivityProgress
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
