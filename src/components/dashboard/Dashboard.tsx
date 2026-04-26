import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from './TaskCard';
import { TaskAnalytics } from './TaskAnalytics';
import { Floating3DElement } from '../ui/Floating3DElement';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  BarChart3, 
  Plus, 
  Calendar, 
  Moon,
  Sun,
  LogOut,
  ListTodo,
  Flame,
  Quote
} from 'lucide-react';

import type { Category, Priority } from '../../types';

const MOTIVATIONAL_QUOTES = [
  "Small daily improvements are the key to staggering long-term results.",
  "You don't have to be great to start, but you have to start to be great.",
  "Focus on being productive instead of busy.",
  "The secret of your future is hidden in your daily routine.",
  "Discipline is choosing between what you want now and what you want most."
];

export const Dashboard: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const { tasks, productivityProgress, addTask } = useTasks();
  const [darkMode, setDarkMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    category: Category | '';
    priority: Priority;
    startTime: string;
    endTime: string;
  }>({
    title: '',
    description: '',
    category: 'Personal',
    priority: 'Medium',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto relative overflow-hidden">
      <Floating3DElement />
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 relative z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            Hey, {userProfile?.displayName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 font-medium text-lg">Ready to crush your goals today?</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleDarkMode}
            className="p-3 aspect-square bg-white/50 dark:bg-gray-800/50 backdrop-blur-md"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="text-red-500 border-red-200 hover:bg-red-50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Left Column: Stats & Progress */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card 
            className="text-white border-none relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl">Total Progress</h3>
              <BarChart3 className="w-6 h-6 opacity-80" />
            </div>
            <div className="relative h-4 bg-white/20 rounded-full mb-2 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${productivityProgress}%` }}
                className="absolute inset-0 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
              />
            </div>
            <p className="font-medium text-white/90 text-right">
              {Math.round(productivityProgress)}% Completed
            </p>
          </Card>

          {/* Streak Card */}
          <Card className="flex items-center gap-4 py-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg">
            <div className="bg-orange-100 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Current Streak</p>
              <div className="flex items-baseline gap-1">
                <motion.h4 
                  key={userProfile?.streak}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-black text-gray-800 dark:text-gray-100"
                >
                  {userProfile?.streak || 0}
                </motion.h4>
                <span className="text-gray-400 font-bold">Days</span>
              </div>
            </div>
          </Card>

          {/* Slogan Card */}
          <Card className="flex flex-col gap-4 relative overflow-hidden bg-indigo-50/80 dark:bg-indigo-900/20 backdrop-blur-md border-indigo-100 dark:border-indigo-800">
            <Quote className="absolute -right-4 -top-4 w-24 h-24 text-indigo-100 dark:text-indigo-900/50 -z-0" />
            <div className="relative z-10">
              <h4 className="font-bold text-indigo-400 uppercase text-xs tracking-widest mb-2">Daily Motivation</h4>
              <p className="text-lg font-medium italic text-indigo-900 dark:text-indigo-200">"{quote}"</p>
            </div>
          </Card>
        </div>

        {/* Middle/Right Column: Task List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6 bg-white/30 dark:bg-gray-800/30 p-4 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-brand-primary" />
              <h2 className="text-2xl font-bold">Your Tasks</h2>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
                <Plus className={`w-4 h-4 mr-2 transition-transform ${showAddForm ? 'rotate-45' : ''}`} /> 
                {showAddForm ? 'Cancel' : 'Add Task'}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <Card className="bg-white/70 dark:bg-gray-800/70 p-4 border-dashed border-2 border-indigo-200 backdrop-blur-xl">
                  <div className="flex flex-col gap-4">
                    <input 
                      placeholder="Task Title" 
                      className="bg-transparent border-b-2 border-gray-200 p-2 outline-none focus:border-brand-primary w-full text-lg font-medium"
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                    />
                    <textarea 
                      placeholder="Description (Optional)" 
                      className="bg-transparent border-b-2 border-gray-200 p-2 outline-none focus:border-brand-primary w-full resize-none"
                      value={newTask.description}
                      onChange={e => setNewTask({...newTask, description: e.target.value})}
                      rows={2}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select 
                        className="bg-transparent border-b-2 border-gray-200 p-2 outline-none focus:border-brand-primary"
                        value={newTask.category}
                        onChange={e => setNewTask({...newTask, category: e.target.value as any})}
                      >
                        <option value="Personal">Personal</option>
                        <option value="Work">Work</option>
                        <option value="Study">Study</option>
                        <option value="Health">Health</option>
                        <option value="Other">Other</option>
                      </select>
                      <select 
                        className="bg-transparent border-b-2 border-gray-200 p-2 outline-none focus:border-brand-primary"
                        value={newTask.priority}
                        onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <span className="absolute -top-3 left-1 text-[10px] text-gray-500 font-bold uppercase">Start Time</span>
                        <input 
                          type="time" 
                          className="w-full bg-transparent border-b-2 border-gray-200 p-2 outline-none focus:border-brand-primary"
                          value={newTask.startTime}
                          onChange={e => setNewTask({...newTask, startTime: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute -top-3 left-1 text-[10px] text-gray-500 font-bold uppercase">End Time</span>
                        <input 
                          type="time" 
                          className="w-full bg-transparent border-b-2 border-gray-200 p-2 outline-none focus:border-brand-primary"
                          value={newTask.endTime}
                          onChange={e => setNewTask({...newTask, endTime: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-6 shadow-lg shadow-indigo-500/30" 
                    size="sm"
                    onClick={async () => {
                      if (!newTask.title) return;
                      await addTask({...newTask, completed: false});
                      setShowAddForm(false);
                      setNewTask({ title: '', description: '', category: 'Personal', priority: 'Medium', startTime: '', endTime: '' });
                    }}
                  >
                    Save Task
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <AnimatePresence>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                  >
                    <TaskCard task={task} />
                  </motion.div>
                ))
              ) : (
                <Card className="text-center py-12 flex flex-col items-center opacity-80 backdrop-blur-md">
                  <ListTodo className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No tasks found</h3>
                  <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                    You have an empty slate. Start adding tasks manually to get organized!
                  </p>
                  <Button onClick={() => setShowAddForm(true)} variant="primary">
                    Create Your First Task
                  </Button>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Analytics Section */}
      <TaskAnalytics />
    </div>
  );
};
