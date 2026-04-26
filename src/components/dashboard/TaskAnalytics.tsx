import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { useTasks } from '../../context/TaskContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

export const TaskAnalytics: React.FC = () => {
  const { tasks } = useTasks();

  const isEmpty = tasks.length === 0;

  const categoryData = useMemo(() => {
    if (isEmpty) {
      return [{ name: 'Empty', value: 1 }];
    }
    const counts: Record<string, number> = {};
    tasks.forEach(t => {
      counts[t.category || 'Other'] = (counts[t.category || 'Other'] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks, isEmpty]);

  const completionData = useMemo(() => {
    if (isEmpty) {
      return [
        { name: 'Completed', count: 0 },
        { name: 'Pending', count: 0 }
      ];
    }
    let completed = 0;
    let pending = 0;
    tasks.forEach(t => {
      if (t.completed) completed++;
      else pending++;
    });
    return [
      { name: 'Completed', count: completed },
      { name: 'Pending', count: pending }
    ];
  }, [tasks, isEmpty]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-12">
      <Card className="flex flex-col items-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20 shadow-2xl">
        <div className="flex items-center gap-2 mb-6 w-full text-brand-primary">
          <PieChartIcon className="w-6 h-6" />
          <h3 className="font-bold text-lg">Category Distribution</h3>
        </div>
        <div className="w-full h-72 relative">
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <p className="text-gray-400 font-medium">Add tasks to see distribution</p>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                opacity={isEmpty ? 0.2 : 1}
              >
                {categoryData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={isEmpty ? '#cbd5e1' : COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {!isEmpty && (
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              )}
              {!isEmpty && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="flex flex-col items-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20 shadow-2xl">
        <div className="flex items-center gap-2 mb-6 w-full text-brand-secondary">
          <BarChartIcon className="w-6 h-6" />
          <h3 className="font-bold text-lg">Completion Insights</h3>
        </div>
        <div className="w-full h-72 relative">
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <p className="text-gray-400 font-medium">Start completing tasks to see progress</p>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completionData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              {!isEmpty && (
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              )}
              <Bar dataKey="count" radius={[6, 6, 0, 0]} opacity={isEmpty ? 0.2 : 1}>
                {completionData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={isEmpty ? '#cbd5e1' : (index === 0 ? '#10b981' : '#f59e0b')} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
