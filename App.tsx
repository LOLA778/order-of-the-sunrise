


import React, { useState, useEffect } from 'react';
import { PathId, UserData, NotificationSettings } from './types';
import { useAppData } from './hooks/useAppData';
import InitiationScreen from './components/InitiationScreen';
import ProfileView from './components/Dashboard';
import BottomNav from './components/BottomNav';
import PathView from './components/PathView';
import WorkoutView from './components/WorkoutView';
import ReadingView from './components/ReadingView';
import ReadingPlanSelector from './components/ReadingPlanSelector';
import Settings from './components/Settings';
import SpiritView from './components/SpiritView';
import FinanceView from './components/FinanceView';
import { PATHS, READING_PLANS, LEVELS } from './constants';

const App: React.FC = () => {
  const {
    userData,
    initiateUser,
    updateTaskProgress,
    levelUp,
    selectReadingPlan,
    updateBookProgress,
    currentLevelData,
    progressPercentage,
    daysLeftForCheckIn,
    canLevelUp,
    currentWorkout,
    currentReadingPlan,
    currentBook,
    // Settings functions
    updateNotificationSettings,
    setWimHofVideo,
    addCustomBook,
    removeCustomBook,
    updateCustomBookProgress,
    uploadBookForPlan,
    changeLevel,
    logCumulativeStat,
    // Finance functions
    addFinancialGoal,
    updateFinancialGoal,
    removeFinancialGoal,
  } = useAppData();

  const [activePath, setActivePath] = useState<PathId>(PathId.DASHBOARD);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default' && userData?.isInitiated) {
      Notification.requestPermission();
    }
  }, [userData?.isInitiated]);

  useEffect(() => {
    if (!userData || !userData.notificationSettings) return;

    const scheduleNotification = (key: string, settings: NotificationSettings) => {
      const setting = settings[key];
      if (setting && setting.enabled) {
        const [hours, minutes] = setting.time.split(':').map(Number);
        const now = new Date();
        const notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
        
        let timeout = notificationTime.getTime() - now.getTime();
        
        if (timeout < 0) {
            // If time has passed for today, schedule for tomorrow
            notificationTime.setDate(notificationTime.getDate() + 1);
            timeout = notificationTime.getTime() - now.getTime();
        }

        const messages: { [key: string]: { title: string, body: string } } = {
            wakeUp: { title: 'ПОДЪЕМ, ВОИН!', body: 'Твой враг еще спит. Хватит тратить дневной свет. Иди и возьми свое.' },
            workout: { title: 'ВРЕМЯ СТРАДАТЬ!', body: 'Иди и найди боль. Закали свой разум. Они не знают, на что ты способен!' },
            reading: { title: 'ВООРУЖИ СВОЙ РАЗУМ!', body: 'Не будь тупицей. Битва выигрывается сначала в голове. Прочитай свои страницы.' },
            reflection: { title: 'ЗЕРКАЛО ОТВЕТСТВЕННОСТИ!', body: 'Посмотри себе в глаза. Ты отдал всего себя? Признай свои слабости. Завтра стань лучше.' },
        };

        const message = messages[key];
        if(message) {
            setTimeout(() => {
                new Notification(message.title, { body: message.body });
            }, timeout);
        }
      }
    };
    
    Object.keys(userData.notificationSettings).forEach(key => scheduleNotification(key, userData.notificationSettings));
    
  }, [userData?.notificationSettings]);

  if (!userData || !userData.isInitiated) {
    return <InitiationScreen onInitiate={initiateUser} />;
  }
  
  if (!userData.readingPlanId) {
      return <ReadingPlanSelector plans={READING_PLANS} onSelect={selectReadingPlan} />
  }
  
  if (!currentLevelData) {
      return (
          <div className="flex items-center justify-center h-screen text-warm-white">
              <div className="text-center">
                  <h2 className="text-2xl font-bold text-gold">Поздравляем!</h2>
                  <p className="mt-2">Вы завершили все доступные уровни. Вы - Легенда Рассвета!</p>
              </div>
          </div>
      );
  }

  const renderContent = () => {
    switch (activePath) {
        case PathId.DASHBOARD:
            return (
                <ProfileView
                  userData={userData}
                  currentLevelData={currentLevelData}
                  progressPercentage={progressPercentage}
                  daysLeft={daysLeftForCheckIn}
                  canLevelUp={canLevelUp}
                  onLevelUp={levelUp}
                  onOpenSettings={() => setSettingsOpen(true)}
                  onNavigate={setActivePath}
                />
            );
        case PathId.PHYSICS:
            return <WorkoutView workout={currentWorkout} logStat={logCumulativeStat} />;
        case PathId.MIND:
            if (!currentReadingPlan || !currentBook) return null;
            return <ReadingView 
                plan={currentReadingPlan}
                currentBook={currentBook}
                userData={userData}
                updateBookProgress={updateBookProgress}
                customBooks={userData.customBooks}
                onAddCustomBook={addCustomBook}
                onRemoveCustomBook={removeCustomBook}
                onUpdateCustomBookProgress={updateCustomBookProgress}
                uploadBookForPlan={uploadBookForPlan}
            />;
        case PathId.SPIRIT:
             const spiritPath = PATHS.find(p => p.id === PathId.SPIRIT);
             const spiritTasks = spiritPath?.taskCategory ? currentLevelData.tasks[spiritPath.taskCategory] : [];
             return <SpiritView 
                tasks={spiritTasks}
                taskProgress={userData.taskProgress}
                updateTaskProgress={updateTaskProgress}
                wimHofVideoUrl={userData.wimHofVideo}
                logStat={logCumulativeStat}
            />;
        case PathId.FINANCE:
            return <FinanceView
                goals={userData.financialGoals}
                onAddGoal={addFinancialGoal}
                onUpdateGoal={updateFinancialGoal}
                onRemoveGoal={removeFinancialGoal}
            />;
        case PathId.CHALLENGES:
             const pathConfig = PATHS.find(p => p.id === activePath);
             if (pathConfig && pathConfig.taskCategory) {
               const tasks = currentLevelData.tasks[pathConfig.taskCategory];
               return (
                 <PathView
                   pathName={pathConfig.name}
                   tasks={tasks}
                   taskProgress={userData.taskProgress}
                   updateTaskProgress={updateTaskProgress}
                   logStat={logCumulativeStat}
                 />
               );
             }
             return null;
        default:
            const defaultConfig = PATHS.find(p => p.id === activePath);
            if (defaultConfig && defaultConfig.taskCategory) {
              const tasks = currentLevelData.tasks[defaultConfig.taskCategory];
              return (
                <PathView
                  pathName={defaultConfig.name}
                  tasks={tasks}
                  taskProgress={userData.taskProgress}
                  updateTaskProgress={updateTaskProgress}
                  logStat={logCumulativeStat}
                />
              );
            }
            return null;
    }
  };

  return (
    <div className="h-screen w-screen fixed inset-0 overflow-y-auto">
      <main className="flex-grow container mx-auto p-4 sm:p-6 pb-28">
         <div key={activePath} className="animate-content-fade-in">
            {renderContent()}
        </div>
      </main>
      <BottomNav activePath={activePath} setActivePath={setActivePath} />
      {isSettingsOpen && (
        <Settings
            userData={userData}
            onClose={() => setSettingsOpen(false)}
            onUpdateNotifications={updateNotificationSettings}
            onSetWimHofVideo={setWimHofVideo}
            onChangeLevel={changeLevel}
            allLevels={LEVELS}
        />
      )}
      <style>{`
        .animate-content-fade-in { 
            animation: contentFadeIn 0.6s cubic-bezier(0.25, 1, 0.5, 1) both;
        }
        @keyframes contentFadeIn { 
            0% { opacity: 0; transform: translateY(10px); } 
            100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
