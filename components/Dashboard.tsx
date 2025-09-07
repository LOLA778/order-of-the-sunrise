
import React from 'react';
import { UserData, Level, PathId, Task } from '../types';
import Card from './shared/Card';
import SettingsIcon from './icons/SettingsIcon';
import { ACHIEVEMENTS, PATHS } from '../constants';
import CircularProgressBar from './shared/CircularProgressBar';

interface ProfileViewProps {
  userData: UserData;
  currentLevelData: Level;
  progressPercentage: number;
  daysLeft: number;
  canLevelUp: boolean;
  onLevelUp: () => void;
  onOpenSettings: () => void;
  onNavigate: (pathId: PathId) => void;
}

const PathProgressSummary: React.FC<{
  levelData: Level,
  taskProgress: UserData['taskProgress'],
  onNavigate: (pathId: PathId) => void,
}> = ({ levelData, taskProgress, onNavigate }) => {

  const calculatePathProgress = (tasks: Task[]) => {
      if (!tasks || tasks.length === 0) return 100; // No tasks means 100% complete
      const completed = tasks.filter(task => {
          const progress = taskProgress[task.id];
          if (typeof progress === 'boolean') return progress;
          if (typeof progress === 'number') return progress >= task.target;
          return false;
      }).length;
      return Math.round((completed / tasks.length) * 100);
  };
  
  const pathsToShow = [PathId.PHYSICS, PathId.MIND, PathId.SPIRIT, PathId.CHALLENGES];

  return (
    <Card>
      <h2 className="text-xl font-bold text-warm-white mb-4">Дневной Прогресс</h2>
      <div className="grid grid-cols-2 gap-4">
        {pathsToShow.map(pathId => {
          const pathConfig = PATHS.find(p => p.id === pathId);
          if (!pathConfig || !pathConfig.taskCategory) return null;

          const tasks = levelData.tasks[pathConfig.taskCategory];
          if (!tasks || tasks.length === 0) return null;
          
          const percentage = calculatePathProgress(tasks);

          return (
            <div key={pathId} onClick={() => onNavigate(pathId)} className="bg-black/20 p-3 rounded-lg cursor-pointer hover:bg-black/30 transition-colors flex flex-col items-center text-center">
                <CircularProgressBar percentage={percentage} size={80} strokeWidth={6} />
                <h3 className="font-bold text-steel-gray text-sm mt-2">{pathConfig.name}</h3>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

const ProfileView: React.FC<ProfileViewProps> = ({
  userData,
  currentLevelData,
  progressPercentage,
  daysLeft,
  canLevelUp,
  onLevelUp,
  onOpenSettings,
  onNavigate,
}) => {
  const unlockedAchievements = ACHIEVEMENTS.filter(ach => userData.achievements.includes(ach.id));

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-warm-white tracking-tight">{currentLevelData.name}</h1>
          <p className="text-md text-steel-gray">Уровень {currentLevelData.level}</p>
        </div>
        <button onClick={onOpenSettings} className="text-steel-gray hover:text-gold p-2">
            <SettingsIcon className="h-6 w-6" />
        </button>
      </header>
      
      <Card>
        <h2 className="text-xl font-bold text-warm-white mb-3">Прогресс до Проверки</h2>
        <div className="flex justify-between items-center mb-2">
            <span className="text-steel-gray">{daysLeft > 0 ? `${daysLeft} дней осталось` : 'Время проверки!'}</span>
            <span className="font-bold text-gold text-lg">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
            <div
                className="bg-fire-gradient h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
            ></div>
        </div>
        {canLevelUp && (
          <button 
            onClick={onLevelUp}
            className={`w-full mt-4 px-6 py-3 bg-fire-gradient text-black font-bold rounded-lg hover:shadow-fire-glow transition-shadow animate-pulse-fire`}
          >
            ПОВЫСИТЬ УРОВЕНЬ
          </button>
        )}
      </Card>
      
      <PathProgressSummary 
        levelData={currentLevelData}
        taskProgress={userData.taskProgress}
        onNavigate={onNavigate}
      />
      
      {unlockedAchievements.length > 0 && (
          <Card>
              <h2 className="text-xl font-bold text-warm-white mb-4">Достижения</h2>
              <div className="space-y-3">
                  {unlockedAchievements.map(ach => (
                      <div key={ach.id} className="p-3 bg-black/20 rounded-lg">
                          <p className="font-bold text-gold">{ach.name}</p>
                          <p className="text-sm text-steel-gray">{ach.description}</p>
                      </div>
                  ))}
              </div>
          </Card>
      )}
    <style>{`
      .bg-fire-gradient { background-image: linear-gradient(to right, #E63946, #FF6B35, #FFD700); }
      .text-gold { color: #FFD700; }
      .text-warm-white { color: #F8F0E3; }
      .text-steel-gray { color: #C0A080; }
      .hover\\:shadow-fire-glow:hover { box-shadow: 0 0 15px rgba(255, 107, 53, 0.6); }
    `}</style>
    </div>
  );
};

export default ProfileView;