import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from './TaskCard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  BarChart3, 
  Plus, 
  Flame, 
  Calendar, 
  Sparkles, 
  Quote,
  RefreshCw,
  Moon,
  Sun
} from 'lucide-react';
import { MOTIVATIONAL_QUOTES, SUGGESTIONS } from '../../utils/routineData';

import { format } from 'date-fns';
import type { Category, Priority } from '../../types';

export const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const { tasks, productivityProgress, generateDailyRoutine, addTask } = useTasks();
  const [quote, setQuote] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    category: Category;
    priority: Priority;
    startTime: string;
    endTime?: string;
  }>({
    title: '',
    category: 'Study',
    priority: 'Medium',
    startTime: format(new Date(), 'HH:mm'),
    endTime: '',
  });

  useEffect(() => {
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    setSuggestion(SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)]);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            Hey, {userProfile?.displayName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 font-medium">Ready to crush your goals today?</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleDarkMode}
            className="p-3 aspect-square"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Progress */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white border-none">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl">Today's Progress</h3>
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
          <Card className="flex items-center gap-4 py-4">
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
                  className="text-3xl font-black"
                >
                  {userProfile?.streak || 0}
                </motion.h4>
                <span className="text-gray-400 font-bold">Days</span>
              </div>
            </div>
          </Card>

          {/* Suggestions Card */}
          <Card className="bg-blue-50/50 dark:bg-blue-900/20">
            <div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
              <h4 className="font-bold">Smart Suggestion</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 italic">"{suggestion}"</p>
          </Card>

          {/* Quote Card */}
          <Card className="flex flex-col gap-4 relative overflow-hidden">
            <Quote className="absolute -right-4 -top-4 w-24 h-24 text-gray-100 dark:text-gray-800 -z-0" />
            <div className="relative z-10">
              <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-2">Daily Motivation</h4>
              <p className="text-lg font-medium italic">"{quote}"</p>
            </div>
          </Card>
        </div>

        {/* Middle/Right Column: Task List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-brand-primary" />
              <h2 className="text-2xl font-bold">Your Schedule</h2>
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
                <Card className="bg-white/50 dark:bg-gray-800/50 p-4 border-dashed border-2">
                  <div className="flex flex-col gap-4">
                    <input 
                      placeholder="Task Title" 
                      className="bg-transparent border-b-2 border-gray-200 p-2 outline-none focus:border-brand-primary w-full"
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                    />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <select 
                        className="bg-transparent border-b-2 border-gray-200 p-2 outline-none focus:border-brand-primary"
                        value={newTask.category}
                        onChange={e => setNewTask({...newTask, category: e.target.value as any})}
                      >
                        <option value="Study">Study</option>
                        <option value="College">College</option>
                        <option value="Teaching">Teaching</option>
                        <option value="Personal">Personal</option>
                        <option value="Skill Development">Skill Development</option>
                      </select>
                      <select 
                        className="bg-transparent border-b-2 border-gray-200 p-2 outline-none focus:border-brand-primary"
                        value={newTask.priority}
                        onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <div className="relative">
                        <span className="absolute -top-3 left-1 text-[10px] text-gray-500 font-bold uppercase">Start</span>
                        <input 
                          type="time" 
                          className="w-full bg-transparent border-b-2 border-gray-200 p-2 outline-none focus:border-brand-primary"
                          value={newTask.startTime}
                          onChange={e => setNewTask({...newTask, startTime: e.target.value})}
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute -top-3 left-1 text-[10px] text-gray-500 font-bold uppercase">End</span>
                        <input 
                          type="time" 
                          className="w-full bg-transparent border-b-2 border-gray-200 p-2 outline-none focus:border-brand-primary"
                          value={newTask.endTime || ''}
                          onChange={e => setNewTask({...newTask, endTime: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    size="sm"
                    onClick={async () => {
                      if (!newTask.title) return;
                      await addTask({...newTask, date: format(new Date(), 'yyyy-MM-dd'), completed: false, isAutoGenerated: false});
                      setShowAddForm(false);
                      setNewTask({ title: '', category: 'Study', priority: 'Medium', startTime: format(new Date(), 'HH:mm'), endTime: '' });
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
                <Card className="text-center py-12 flex flex-col items-center opacity-80">
                  <RefreshCw className="w-12 h-12 text-gray-300 mb-4 animate-spin-pulse" />
                  <h3 className="text-xl font-bold mb-2">No tasks for today yet</h3>
                  <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                    Click "Auto-Generate" to populate your smart B.Tech routine.
                  </p>
                  <Button onClick={generateDailyRoutine} variant="primary">
                    Generate My Routine
                  </Button>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
