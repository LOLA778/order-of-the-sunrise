export enum TaskType {
  CHECKBOX = 'CHECKBOX',
  NUMBER = 'NUMBER',
  TIMER = 'TIMER',
}

export interface Task {
  id: string;
  description: string;
  target: number; // For NUMBER: target value. For TIMER: duration in minutes.
  type: TaskType;
  statId?: string; // e.g., 'pushups', 'meditationMinutes'
}

export interface LevelTasks {
  physics: Task[];
  mind: Task[];
  spirit: Task[];
  skills: Task[];
  extra: Task[];
}

export interface Level {
  level: number;
  name: string;
  tasks: LevelTasks;
}

export enum PathId {
  DASHBOARD = 'DASHBOARD',
  PHYSICS = 'PHYSICS',
  MIND = 'MIND',
  SPIRIT = 'SPIRIT',
  CHALLENGES = 'CHALLENGES',
  FINANCE = 'FINANCE',
}

export interface Path {
  id: PathId;
  name: string;
  taskCategory: keyof LevelTasks | null;
}

export interface TaskProgress {
  [taskId: string]: number | boolean;
}

export interface Exercise {
  name: string;
  sets: string;
}

export interface Workout {
  day: string;
  name: string;
  duration: string;
  exercises: Exercise[];
}

export interface Book {
    title: string;
    author: string;
    pages: number;
    // For custom books
    id?: string;
    currentPage?: number;
    content?: string; // Base64 Data URL for PDF
}

export interface ReadingPlan {
    id:string;
    name: string;
    description: string;
    books: Book[];
    dailyGoal: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  threshold?: number; // For cumulative achievements
  statId?: string;
}

export interface NotificationSetting {
    enabled: boolean;
    time: string; // "HH:MM" format
}

export interface NotificationSettings {
    [key: string]: NotificationSetting;
}

export interface FinancialGoal {
  id: string;
  name: string;
  target: number;
  current: number;
}

export interface UserData {
  isInitiated: boolean;
  startDate: number;
  currentLevel: number;
  taskProgress: TaskProgress;
  readingPlanId?: string;
  currentBookIndex: number;
  currentBookPage: number;
  achievements: string[];
  wimHofVideo?: string; // Base64 data URL
  customBooks: Book[];
  notificationSettings: NotificationSettings;
  planBookContent: { [bookTitle: string]: string };
  cumulativeStats: { [statId: string]: number };
  financialGoals: FinancialGoal[];
}