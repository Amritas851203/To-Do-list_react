import React, { useState } from 'react';
import { type Task } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle2, Circle, Clock, Trash2, Edit2, X, Save } from 'lucide-react';
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
  Work: 'bg-indigo-500',
  Other: 'bg-gray-500',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    startTime: task.startTime || '',
    endTime: task.endTime || ''
  });

  const toggleComplete = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  const handleSaveEdit = () => {
    updateTask(task.id, editForm);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="mb-4 relative border-dashed border-2">
        <div className="flex flex-col gap-3">
          <input 
            className="w-full bg-transparent border-b border-gray-300 p-1 font-bold text-lg outline-none"
            value={editForm.title}
            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
            placeholder="Task Title"
          />
          <textarea 
            className="w-full bg-transparent border-b border-gray-300 p-1 text-sm outline-none resize-none"
            value={editForm.description}
            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
            placeholder="Description (Optional)"
            rows={2}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <select 
              className="bg-transparent border-b border-gray-300 p-1 text-sm outline-none"
              value={editForm.priority}
              onChange={(e) => setEditForm({...editForm, priority: e.target.value as any})}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input 
              type="time"
              className="bg-transparent border-b border-gray-300 p-1 text-sm outline-none"
              value={editForm.startTime}
              onChange={(e) => setEditForm({...editForm, startTime: e.target.value})}
            />
            <input 
              type="time"
              className="bg-transparent border-b border-gray-300 p-1 text-sm outline-none"
              value={editForm.endTime}
              onChange={(e) => setEditForm({...editForm, endTime: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEdit}>
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const categoryColor = categoryColors[task.category || 'Other'] || 'bg-gray-500';

  return (
    <Card className={`mb-4 relative overflow-hidden flex items-start gap-4 transition-all ${task.completed ? 'opacity-60 grayscale' : ''}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${categoryColor}`} />
      
      <button 
        onClick={toggleComplete}
        className="checkbox-pop group focus:outline-none mt-1"
      >
        {task.completed ? (
          <CheckCircle2 className="w-8 h-8 text-brand-primary" />
        ) : (
          <Circle className="w-8 h-8 text-gray-300 group-hover:text-brand-primary transition-colors" />
        )}
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full text-white ${categoryColor}`}>
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

        {task.description && (
          <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400 line-through' : 'text-gray-600 dark:text-gray-300'}`}>
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-3 mt-2">
          {task.startTime && (
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Start: {task.startTime}</span>
            </div>
          )}
          {task.endTime && (
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>End: {task.endTime}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 text-gray-300 hover:text-blue-500 transition-colors"
          title="Edit Task"
        >
          <Edit2 className="w-5 h-5" />
        </button>
        <button 
          onClick={() => deleteTask(task.id)}
          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
          title="Delete Task"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </Card>
  );
};
