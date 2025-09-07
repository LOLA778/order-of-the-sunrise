import { useState, useEffect, useMemo, useCallback } from 'react';
import { UserData, Task, ReadingPlan, Book, Workout, NotificationSettings, NotificationSetting, Level, TaskType, FinancialGoal } from '../types';
import { LEVELS, CHECK_IN_DAYS, LEVEL_UP_THRESHOLD, READING_PLANS, WORKOUTS_BY_DAY, ACHIEVEMENTS } from '../constants';
import { useToast } from '../components/shared/Toast';

const APP_DATA_KEY = 'orderOfTheSunriseData';

const getInitialData = (): UserData => {
  const savedData = localStorage.getItem(APP_DATA_KEY);
  if (savedData) {
    const parsed = JSON.parse(savedData);
    // Migration for old journal structure
    if (parsed.journal) {
      delete parsed.journal;
    }
    return {
        ...parsed,
        currentBookIndex: parsed.currentBookIndex ?? 0,
        currentBookPage: parsed.currentBookPage ?? 0,
        achievements: parsed.achievements ?? [],
        customBooks: parsed.customBooks ?? [],
        planBookContent: parsed.planBookContent ?? {},
        cumulativeStats: parsed.cumulativeStats ?? {},
        notificationSettings: parsed.notificationSettings ?? {
            wakeUp: { enabled: false, time: '06:00' },
            workout: { enabled: false, time: '07:00' },
            reading: { enabled: false, time: '21:00' },
            reflection: { enabled: false, time: '22:00' },
        },
        financialGoals: parsed.financialGoals ?? [],
    };
  }
  return {
    isInitiated: false,
    startDate: 0,
    currentLevel: 1,
    taskProgress: {},
    readingPlanId: undefined,
    currentBookIndex: 0,
    currentBookPage: 0,
    achievements: [],
    wimHofVideo: undefined,
    customBooks: [],
    planBookContent: {},
    cumulativeStats: {},
    notificationSettings: {
        wakeUp: { enabled: false, time: '06:00' },
        workout: { enabled: false, time: '07:00' },
        reading: { enabled: false, time: '21:00' },
        reflection: { enabled: false, time: '22:00' },
    },
    financialGoals: [],
  };
};

export const useAppData = () => {
  const [userData, setUserData] = useState<UserData>(getInitialData);
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem(APP_DATA_KEY, JSON.stringify(userData));
  }, [userData]);
  
  const awardAchievement = useCallback((achievementId: string) => {
      if (!userData.achievements.includes(achievementId)) {
          const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
          if (achievement) {
              setUserData(prev => ({
                  ...prev,
                  achievements: [...prev.achievements, achievementId]
              }));
              addToast(`Достижение получено: ${achievement.name}!`);
          }
      }
  }, [userData.achievements, addToast]);
  
  const logCumulativeStat = useCallback((statId: string, value: number) => {
    if (isNaN(value) || value <= 0) return;
    setUserData(prev => ({
        ...prev,
        cumulativeStats: {
            ...prev.cumulativeStats,
            [statId]: (prev.cumulativeStats[statId] || 0) + value,
        }
    }));
  }, []);

  // Achievement checker
  useEffect(() => {
    if (!userData.isInitiated) return;
    
    // Level achievements
    if (userData.currentLevel >= 2) awardAchievement('LEVEL_2');
    if (userData.currentLevel >= 3) awardAchievement('LEVEL_3');

    // Cumulative achievements
    ACHIEVEMENTS.forEach(ach => {
        if (ach.statId && ach.threshold) {
            const currentStat = userData.cumulativeStats[ach.statId] || 0;
            if (currentStat >= ach.threshold) {
                awardAchievement(ach.id);
            }
        }
    });

  }, [userData.currentLevel, userData.isInitiated, userData.cumulativeStats, awardAchievement]);

  const initiateUser = useCallback(() => {
    setUserData(prevData => ({
      ...getInitialData(), // Reset everything to default
      isInitiated: true,
      startDate: Date.now(),
      achievements: ['FIRST_STEP'],
    }));
    addToast('Путь начат! Достижение получено: Первый Шаг!');
  }, [addToast]);
  
  const selectReadingPlan = useCallback((planId: string) => {
      setUserData(prevData => ({
          ...prevData,
          readingPlanId: planId,
          currentBookIndex: 0,
          currentBookPage: 0,
      }));
  }, []);

  const updateBookProgress = useCallback((page: number) => {
    const plan = READING_PLANS.find(p => p.id === userData.readingPlanId);
    if (!plan) return;
    
    const currentBook = plan.books[userData.currentBookIndex];
    const newPage = Math.max(0, Math.min(page, currentBook.pages));

    if (newPage >= currentBook.pages) {
        const nextBookIndex = userData.currentBookIndex + 1;
        if (nextBookIndex < plan.books.length) {
            setUserData(prevData => ({
                ...prevData,
                currentBookIndex: nextBookIndex,
                currentBookPage: 0
            }));
        } else {
             setUserData(prevData => ({ ...prevData, currentBookPage: newPage }));
        }
    } else {
        setUserData(prevData => ({ ...prevData, currentBookPage: newPage }));
    }
  }, [userData.readingPlanId, userData.currentBookIndex]);

  const currentLevelData = useMemo(() => {
    return LEVELS.find(l => l.level === userData.currentLevel) || null;
  }, [userData.currentLevel]);

  const allTasksForCurrentLevel: Task[] = useMemo(() => {
    if (!currentLevelData) return [];
    return Object.values(currentLevelData.tasks).flat();
  }, [currentLevelData]);

  const updateTaskProgress = useCallback((taskId: string, value: number | boolean) => {
    setUserData(prevData => ({
      ...prevData,
      taskProgress: {
        ...prevData.taskProgress,
        [taskId]: value,
      },
    }));

    // Log stats for completed timer tasks
    const task = allTasksForCurrentLevel.find(t => t.id === taskId);
    if (task && task.type === TaskType.TIMER && value === true && task.statId) {
        logCumulativeStat(task.statId, task.target);
    }

  }, [allTasksForCurrentLevel, logCumulativeStat]);


  const progressPercentage = useMemo(() => {
    if (allTasksForCurrentLevel.length === 0) return 0;

    const completedTasks = allTasksForCurrentLevel.filter(task => {
        const progress = userData.taskProgress[task.id];
        if (typeof progress === 'boolean') return progress;
        if (typeof progress === 'number') return progress >= task.target;
        return false;
    }).length;

    return Math.round((completedTasks / allTasksForCurrentLevel.length) * 100);
  }, [allTasksForCurrentLevel, userData.taskProgress]);

  const daysLeftForCheckIn = useMemo(() => {
    const elapsedMs = Date.now() - userData.startDate;
    const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(CHECK_IN_DAYS - elapsedDays));
  }, [userData.startDate]);

  const canLevelUp = useMemo(() => {
      return daysLeftForCheckIn <= 0 && progressPercentage >= (LEVEL_UP_THRESHOLD * 100);
  }, [daysLeftForCheckIn, progressPercentage]);

  const levelUp = useCallback(() => {
      if (canLevelUp) {
          if (progressPercentage === 100) {
              awardAchievement('PERFECT_CHECK_IN');
          }
          const nextLevel = userData.currentLevel + 1;
          if (LEVELS.some(l => l.level === nextLevel)) {
              setUserData(prevData => ({
                  ...prevData,
                  currentLevel: nextLevel,
                  startDate: Date.now(),
                  taskProgress: {}
              }));
          }
      }
  }, [canLevelUp, userData.currentLevel, progressPercentage, awardAchievement]);

  // --- Settings Functions ---
  const updateNotificationSettings = useCallback((key: string, setting: NotificationSetting) => {
      setUserData(prev => ({
          ...prev,
          notificationSettings: { ...prev.notificationSettings, [key]: setting }
      }));
  }, []);

  const setWimHofVideo = useCallback((videoDataUrl: string) => {
      setUserData(prev => ({ ...prev, wimHofVideo: videoDataUrl }));
  }, []);
  
  const addCustomBook = useCallback((book: Omit<Book, 'author' | 'pages'> & { content: string, pages: number, author: string }) => {
      const newBook: Book = {
        ...book,
        id: Date.now().toString(),
        currentPage: 0,
      }
      setUserData(prev => ({ ...prev, customBooks: [...prev.customBooks, newBook] }));
  }, []);

  const removeCustomBook = useCallback((bookId: string) => {
      setUserData(prev => ({ ...prev, customBooks: prev.customBooks.filter(b => b.id !== bookId) }));
  }, []);

  const updateCustomBookProgress = useCallback((bookId: string, page: number) => {
    setUserData(prev => ({
        ...prev,
        customBooks: prev.customBooks.map(book => {
            if (book.id === bookId) {
                return { ...book, currentPage: Math.max(0, Math.min(page, book.pages)) };
            }
            return book;
        })
    }));
  }, []);

  const uploadBookForPlan = useCallback((bookTitle: string, content: string) => {
    setUserData(prev => ({
        ...prev,
        planBookContent: {
            ...prev.planBookContent,
            [bookTitle]: content,
        }
    }));
  }, []);

  const changeLevel = useCallback((level: number) => {
    if (LEVELS.some(l => l.level === level)) {
        setUserData(prev => ({
            ...prev,
            currentLevel: level,
            startDate: Date.now(),
            taskProgress: {}
        }));
    }
  }, []);

  // --- Finance Functions ---
  const addFinancialGoal = useCallback((name: string, target: number) => {
    const newGoal: FinancialGoal = {
      id: Date.now().toString(),
      name,
      target,
      current: 0,
    };
    setUserData(prev => ({ ...prev, financialGoals: [...prev.financialGoals, newGoal] }));
  }, []);

  const updateFinancialGoal = useCallback((goalId: string, current: number) => {
    setUserData(prev => ({
      ...prev,
      financialGoals: prev.financialGoals.map(goal =>
        goal.id === goalId ? { ...goal, current: Math.max(0, Math.min(current, goal.target)) } : goal
      ),
    }));
  }, []);

  const removeFinancialGoal = useCallback((goalId: string) => {
    setUserData(prev => ({
      ...prev,
      financialGoals: prev.financialGoals.filter(goal => goal.id !== goalId),
    }));
  }, []);


  const currentWorkout: Workout = useMemo(() => {
      const dayOfWeek = new Date().getDay();
      return WORKOUTS_BY_DAY[dayOfWeek];
  }, []);

  const currentReadingPlan: ReadingPlan | undefined = useMemo(() => {
      return READING_PLANS.find(p => p.id === userData.readingPlanId);
  }, [userData.readingPlanId]);
  
  const currentBook: Book | undefined = useMemo(() => {
      return currentReadingPlan?.books[userData.currentBookIndex];
  }, [currentReadingPlan, userData.currentBookIndex]);

  return {
    userData,
    initiateUser,
    updateTaskProgress,
    levelUp,
    selectReadingPlan,
    updateBookProgress,
    currentLevelData,
    allTasksForCurrentLevel,
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
  };
};