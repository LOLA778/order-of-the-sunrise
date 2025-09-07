
import React from 'react';
import { Task, TaskProgress } from '../types';
import TaskItem from './TaskItem';
import Card from './shared/Card';

interface SpiritViewProps {
  tasks: Task[];
  taskProgress: TaskProgress;
  updateTaskProgress: (taskId: string, value: number | boolean) => void;
  wimHofVideoUrl?: string;
  logStat: (statId: string, value: number) => void;
}

const SpiritView: React.FC<SpiritViewProps> = ({ tasks, taskProgress, updateTaskProgress, wimHofVideoUrl, logStat }) => {
  return (
    <div className="space-y-6">
       <header>
        <h1 className="text-4xl md:text-5xl font-black text-warm-white tracking-tight">Дух</h1>
      </header>
      
      <Card>
          <h2 className="text-xl font-bold text-warm-white mb-4">Задачи на сегодня</h2>
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
      </Card>
      
      {wimHofVideoUrl && (
        <Card>
            <h2 className="text-xl font-bold text-warm-white mb-4">Практика: Метод Вима Хофа</h2>
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-inner border border-gold/20">
                <video controls src={wimHofVideoUrl} className="w-full h-full">
                    Ваш браузер не поддерживает это видео.
                </video>
            </div>
        </Card>
      )}
      <style>{`
        .text-warm-white { color: #F8F0E3; }
        .border-gold\\/20 { border-color: rgba(255, 215, 0, 0.2); }
      `}</style>
    </div>
  );
};

export default SpiritView;
