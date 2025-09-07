


import React from 'react';
import { Task, TaskType } from '../types';
import TaskTimer from './TaskTimer';
import Card from './shared/Card';

interface TaskItemProps {
  task: Task;
  progress: number | boolean | undefined;
  onUpdate: (taskId: string, value: number | boolean) => void;
  logStat?: (statId: string, value: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, progress, onUpdate, logStat }) => {
  const isCompleted = typeof progress === 'boolean' ? progress : typeof progress === 'number' ? progress >= task.target : false;

  const renderInput = () => {
    switch (task.type) {
      case TaskType.CHECKBOX:
        return (
          <label className="custom-checkbox-container">
            <input
              type="checkbox"
              checked={!!progress}
              onChange={(e) => onUpdate(task.id, e.target.checked)}
              className="hidden"
            />
            <span className="checkmark"></span>
          </label>
        );
      case TaskType.NUMBER:
        return (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={typeof progress === 'number' ? progress : 0}
              onChange={(e) => onUpdate(task.id, parseInt(e.target.value) || 0)}
              className="w-20 bg-black/30 border border-gold/30 rounded-md p-2 text-center text-warm-white focus:ring-gold focus:border-gold"
              min="0"
            />
            <span className="text-steel-gray">/ {task.target}</span>
          </div>
        );
      case TaskType.TIMER:
        return (
            <TaskTimer 
                task={task}
                isCompleted={isCompleted}
                onComplete={() => {
                    onUpdate(task.id, true);
                    if (logStat && task.statId) {
                        logStat(task.statId, task.target);
                    }
                }}
            />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className={`flex justify-between items-center transition-opacity !p-4 ${isCompleted ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex-1 pr-4">
          <p className={`text-lg ${isCompleted ? 'text-steel-gray line-through' : 'text-warm-white'}`}>
              {task.description}
          </p>
        </div>
        {renderInput()}
      </Card>
      <style>{`
        .text-warm-white { color: #F8F0E3; }
        .text-steel-gray { color: #C0A080; }
        .border-gold { border-color: #FFD700; }
        .ring-gold:focus { --tw-ring-color: #FFD700; }

        .custom-checkbox-container {
          display: block;
          position: relative;
          width: 28px;
          height: 28px;
          cursor: pointer;
        }
        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 28px;
          width: 28px;
          background-color: transparent;
          border: 2px solid #C0A080; /* steel-gray */
          border-radius: 6px;
          transition: all 0.2s;
        }
        .custom-checkbox-container input:checked ~ .checkmark {
          background-image: linear-gradient(to right, #E63946, #FF6B35);
          border-color: transparent;
          box-shadow: 0 0 10px rgba(255, 107, 53, 0.6);
        }
        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
          left: 9px;
          top: 4px;
          width: 8px;
          height: 14px;
          border: solid #1A0A0A;
          border-width: 0 3px 3px 0;
          transform: rotate(45deg);
        }
        .custom-checkbox-container input:checked ~ .checkmark:after {
          display: block;
        }
      `}</style>
    </>
  );
};

export default TaskItem;
