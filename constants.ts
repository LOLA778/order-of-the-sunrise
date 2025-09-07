import { Level, Path, PathId, TaskType, Workout, ReadingPlan, Achievement } from './types';

export const LEVELS: Level[] = [
  {
    level: 1,
    name: 'Новобранец Рассвета',
    tasks: {
      physics: [ { id: 'l1_workout', description: 'Выполнить тренировку дня', target: 1, type: TaskType.CHECKBOX } ],
      mind: [ { id: 'l1_reading', description: 'Прочитать дневную норму', target: 1, type: TaskType.CHECKBOX } ],
      spirit: [ { id: 'l1_s1', description: 'Медитация / тишина', target: 3, type: TaskType.TIMER, statId: 'meditationMinutes' } ],
      skills: [
        { id: 'l1_k1', description: 'Ранний подъём (6:00)', target: 1, type: TaskType.CHECKBOX },
        { id: 'l1_k2', description: 'Холодный душ', target: 1, type: TaskType.CHECKBOX },
        { id: 'l1_k3', description: 'Ежедневная запись побед дня', target: 1, type: TaskType.CHECKBOX },
      ],
      extra: [ { id: 'l1_e1', description: 'Короткая пробежка / прогулка', target: 20, type: TaskType.TIMER } ]
    },
  },
  {
    level: 2,
    name: 'Воин Рассвета',
    tasks: {
      physics: [ { id: 'l2_workout', description: 'Выполнить тренировку дня', target: 1, type: TaskType.CHECKBOX } ],
      mind: [ { id: 'l2_reading', description: 'Прочитать дневную норму', target: 1, type: TaskType.CHECKBOX } ],
      spirit: [ { id: 'l2_s1', description: 'Медитация', target: 5, type: TaskType.TIMER, statId: 'meditationMinutes' } ],
      skills: [
        { id: 'l2_k1', description: 'Контроль дофамина (без соцсетей)', target: 1, type: TaskType.CHECKBOX },
        { id: 'l2_k2', description: 'Самонастройка утром', target: 1, type: TaskType.CHECKBOX },
      ],
      extra: [ { id: 'l2_e1', description: 'Тренировка на выносливость', target: 30, type: TaskType.TIMER } ]
    },
  },
    {
    level: 3,
    name: 'Страж Рассвета',
    tasks: {
      physics: [ { id: 'l3_workout', description: 'Выполнить тренировку дня', target: 1, type: TaskType.CHECKBOX } ],
      mind: [ { id: 'l3_reading', description: 'Прочитать дневную норму', target: 1, type: TaskType.CHECKBOX } ],
      spirit: [ { id: 'l3_s1', description: 'Медитация / дыхание', target: 10, type: TaskType.TIMER, statId: 'meditationMinutes' } ],
      skills: [
        { id: 'l3_k1', description: 'Холодный душ 2 раза в день', target: 1, type: TaskType.CHECKBOX },
        { id: 'l3_k2', description: 'Контроль эмоций', target: 1, type: TaskType.CHECKBOX },
        { id: 'l3_k3', description: 'Минимизация отвлекающих факторов', target: 1, type: TaskType.CHECKBOX },
      ],
      extra: [ { id: 'l3_e1', description: 'Экстремальная физ. задача (раз в неделю)', target: 45, type: TaskType.TIMER } ]
    },
  },
  // Levels 4 and 5 could be added here following the pattern
];

export const PATHS: Path[] = [
  { id: PathId.DASHBOARD, name: 'Профиль', taskCategory: null },
  { id: PathId.PHYSICS, name: 'Физика', taskCategory: 'physics' },
  { id: PathId.MIND, name: 'Разум', taskCategory: 'mind' },
  { id: PathId.SPIRIT, name: 'Дух', taskCategory: 'spirit' },
  { id: PathId.CHALLENGES, name: 'Челленджи', taskCategory: 'extra' },
  { id: PathId.FINANCE, name: 'Финансы', taskCategory: null },
];

export const CHECK_IN_DAYS = 15;
export const LEVEL_UP_THRESHOLD = 0.8; // 80% completion

export const ACHIEVEMENTS: Achievement[] = [
    { id: 'FIRST_STEP', name: 'Первый Шаг', description: 'Пройти обряд вступления и начать путь.' },
    { id: 'LEVEL_2', name: 'Воин', description: 'Достигнуть 2-го уровня: Воин Рассвета.' },
    { id: 'LEVEL_3', name: 'Страж', description: 'Достигнуть 3-го уровня: Страж Рассвета.' },
    { id: 'PERFECT_CHECK_IN', name: 'Идеальная Проверка', description: 'Повысить уровень со 100% выполнением задач.' },
    // Cumulative Achievements
    { id: 'PUSHUPS_100', name: 'Железный жим', description: 'Выполнить 100 отжиманий', statId: 'pushups', threshold: 100 },
    { id: 'PUSHUPS_500', name: 'Стальная грудь', description: 'Выполнить 500 отжиманий', statId: 'pushups', threshold: 500 },
    { id: 'PUSHUPS_1000', name: 'Мастер Отжиманий', description: 'Выполнить 1000 отжиманий', statId: 'pushups', threshold: 1000 },
    { id: 'MEDITATION_100', name: 'Спокойный Разум', description: 'Накопить 100 минут медитации', statId: 'meditationMinutes', threshold: 100 },
    { id: 'MEDITATION_500', name: 'Внутренняя Тишина', description: 'Накопить 500 минут медитации', statId: 'meditationMinutes', threshold: 500 },
];


export const WORKOUTS_BY_DAY: { [key: number]: Workout } = {
  0: { // Sunday
    day: "Воскресенье",
    name: "C — смешанная",
    duration: "2 ч",
    exercises: [
      { name: "Приседания + Ягодичный мост (суперсет)", sets: "3×15 каждого" },
      { name: "Подъём коленей лёжа", sets: "3×12–15" },
      { name: "Face pull с резинкой", sets: "3×15–20" },
      { name: "L-sit на полу", sets: "3×10–20 сек" },
      { name: "Бег или скакалка", sets: "15–20 мин" },
      { name: "Растяжка всего тела", sets: "10–15 мин" },
    ],
  },
  1: { // Monday
    day: "Понедельник",
    name: "Отдых и восстановление",
    duration: "N/A",
    exercises: [
        { name: "Лёгкая прогулка", sets: "20-30 мин" },
        { name: "Растяжка", sets: "10 мин" },
    ],
  },
  2: { // Tuesday
    day: "Вторник",
    name: "A — лёгкая сила верх",
    duration: "1 ч",
    exercises: [
      { name: "Сведение лопаток в висе", sets: "3×8–10" },
      { name: "Отжимания от стены / с колен", sets: "4×12–15" },
      { name: "Тяга резинки к груди сидя", sets: "3×12–15" },
      { name: "Вращения плеч резинкой наружу", sets: "3×15–20" },
      { name: "Планка", sets: "3×30–40 сек" },
      { name: "Ходьба быстрым темпом", sets: "10–15 мин" },
    ],
  },
  3: { // Wednesday
    day: "Среда",
    name: "B — ноги и пресс",
    duration: "1 ч",
    exercises: [
      { name: "Приседания", sets: "4×15–20" },
      { name: "Выпады", sets: "3×12–15 на ногу" },
      { name: "Ягодичный мост", sets: "3×12–15" },
      { name: "Русский твист", sets: "3×20" },
      { name: "Подъём коленей лёжа", sets: "3×12–15" },
      { name: "Скакалка или бег трусцой", sets: "5–10 мин" },
    ],
  },
  4: { // Thursday
    day: "Четверг",
    name: "A — лёгкая сила верх",
    duration: "1 ч",
    exercises: [
      { name: "Сведение лопаток в висе", sets: "3×8–10" },
      { name: "Отжимания от стены / с колен", sets: "4×12–15" },
      { name: "Тяга резинки к груди сидя", sets: "3×12–15" },
      { name: "Вращения плеч резинкой наружу", sets: "3×15–20" },
      { name: "Планка", sets: "3×30–40 сек" },
      { name: "Ходьба быстрым темпом", sets: "10–15 мин" },
    ],
  },
  5: { // Friday
    day: "Пятница",
    name: "Лёгкое кардио + мобилизация",
    duration: "1 ч",
    exercises: [
      { name: "Быстрый шаг или бег трусцой", sets: "20–25 мин" },
      { name: "Мобилизация плеч с палкой", sets: "3×10 вперёд/назад" },
      { name: "Face pull с резинкой", sets: "3×15–20" },
      { name: "Планка боковая", sets: "3×20–30 сек на сторону" },
      { name: "Лёгкая растяжка", sets: "5–10 мин" },
    ],
  },
  6: { // Saturday
    day: "Суббота",
    name: "D — техника",
    duration: "2 ч",
    exercises: [
      { name: "Мобилизация плеч с палкой", sets: "5 мин" },
      { name: "Лёгкие подтягивания с резинкой", sets: "3×6–8" },
      { name: "Отжимания с колен или с высокой опоры", sets: "3×12–15" },
      { name: "Подъём ног к перекладине (или лёжа)", sets: "3×8–12" },
      { name: "Планка боковая", sets: "3×20–30 сек на сторону" },
      { name: "Лёгкая практика L-sit", sets: "3×10–20 сек" },
      { name: "Ходьба или бег лёгким темпом", sets: "20–25 мин" },
    ],
  },
};

export const READING_PLANS: ReadingPlan[] = [
    {
        id: 'philosopher_king',
        name: 'Путь Философа-Короля',
        description: 'Философия → ценности → цели → привычки → лидерство. Путь к внутреннему богатству.',
        dailyGoal: 22,
        books: [
            { title: 'Монах, который продал свой феррари', author: 'Робин Шарма', pages: 240 },
            { title: 'Уроки семейной мудрости', author: 'Робин Шарма', pages: 230 },
            { title: 'Исполнение желаний и поиск предназначения', author: 'Робин Шарма', pages: 250 },
            { title: 'Клуб 5 утра', author: 'Робин Шарма', pages: 280 },
            { title: 'Богатство, которое не купишь за деньги', author: 'Робин Шарма', pages: 220 },
            { title: 'Лидер без титула', author: 'Робин Шарма', pages: 230 },
            { title: 'Серфингист и директор', author: 'Робин Шарма', pages: 200 },
            { title: 'Кто заплачет, когда ты умрёшь', author: 'Робин Шарма', pages: 150 },
            { title: 'Я лучший. 101 совет', author: 'Робин Шарма', pages: 150 },
        ]
    },
    {
        id: 'mind_explorer',
        name: 'Путь Исследователя Разума',
        description: 'Художественный мир → логика → память → философия → нон-фикшн → эзотерика. Глубокое погружение.',
        dailyGoal: 50,
        books: [
            { title: 'Дюна', author: 'Фрэнк Герберт', pages: 600 },
            { title: 'Логика', author: 'Георгий Челпанов', pages: 300 },
            { title: 'Мнемоника', author: 'Георгий Челпанов', pages: 250 },
            { title: 'Каран - Библия Тотро', author: 'N/A', pages: 400 },
            { title: 'Вим Хофф - Ледяной человек', author: 'Вим Хофф', pages: 250 },
            { title: '1984', author: 'Джордж Оруэлл', pages: 350 },
            { title: 'Скотный двор', author: 'Джордж Оруэлл', pages: 150 },
            { title: 'О дивный новый мир', author: 'Олдос Хаксли', pages: 350 },
            { title: 'Учение Дона Хуана', author: 'Карлос Кастанеда', pages: 2000 },
        ]
    }
];