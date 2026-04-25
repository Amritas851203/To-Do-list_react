import React from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../../types';
import { Card } from '../ui/Card';
import { CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

interface TaskCardProps {
  task: Task;
}

const categoryColors: Record<string, string> = {
  Study: 'bg-blue-500',
  College: 'bg-purple-500',
  Teaching: 'bg-orange-500',
  Personal: 'bg-green-500',
  Health: 'bg-red-500',
  'Skill Development': 'bg-pink-500',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask } = useTasks();

  const toggleComplete = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  return (
    <Card className={`mb-4 relative overflow-hidden flex items-center gap-4 transition-all ${task.completed ? 'opacity-60 grayscale' : ''}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${categoryColors[task.category] || 'bg-gray-500'}`} />
      
      <button 
        onClick={toggleComplete}
        className="checkbox-pop group focus:outline-none"
      >
        {task.completed ? (
          <CheckCircle2 className="w-8 h-8 text-brand-primary" />
        ) : (
          <Circle className="w-8 h-8 text-gray-300 group-hover:text-brand-primary transition-colors" />
        )}
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full text-white ${categoryColors[task.category]}`}>
            {task.category}
          </span>
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
            task.priority === 'High' ? 'bg-red-100 text-red-600' :
            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
            'bg-green-100 text-green-600'
          }`}>
            {task.priority}
          </span>
        </div>
        
        <h3 className={`text-lg font-bold leading-tight ${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h3>
        
        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{task.startTime} {task.endTime ? `- ${task.endTime}` : ''}</span>
        </div>
      </div>

      <button 
        onClick={() => deleteTask(task.id)}
        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </Card>
  );
};
