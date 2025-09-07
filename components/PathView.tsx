


import React from 'react';
import { Task, TaskProgress } from '../types';
import TaskItem from './TaskItem';

interface PathViewProps {
  pathName: string;
  tasks: Task[];
  taskProgress: TaskProgress;
  updateTaskProgress: (taskId: string, value: number | boolean) => void;
  logStat: (statId: string, value: number) => void;
}

const PathView: React.FC<PathViewProps> = ({ pathName, tasks, taskProgress, updateTaskProgress, logStat }) => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl md:text-5xl font-black text-warm-white tracking-tight">{pathName}</h1>
      </header>
      <div className="space-y-4">
        {tasks.map(task => (
          <TaskItem 
            key={task.id}
            task={task}
            progress={taskProgress[task.id]}
            onUpdate={updateTaskProgress}
            logStat={logStat}
          />
        ))}
      </div>
      <style>{`
        .text-warm-white { color: #F8F0E3; }
      `}</style>
    </div>
  );
};

export default PathView;
