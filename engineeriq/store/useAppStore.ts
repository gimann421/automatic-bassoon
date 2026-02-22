import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALL_LESSONS } from '../data/curriculum';

export type LessonStatus = 'locked' | 'available' | 'completed';

export interface UnitQuizProgress {
  passed: boolean;
  score: number;
  outOf: number;
  xpAwarded: number;
  lastAttemptDate: string;
}

export interface AppState {
  // User
  xp: number;
  streak: number;
  lastActiveDate: string; // ISO date string (YYYY-MM-DD)
  streakFreezeAvailable: boolean;
  streakFreezeUsedThisWeek: boolean;

  // Progress
  lessonProgress: Record<string, LessonStatus>;
  lessonLastCompleted: Record<string, string>; // lessonId -> ISO date string
  lessonContentRead: Record<string, boolean>;  // lessonId -> read flag
  unitQuizProgress: Record<string, UnitQuizProgress>; // unitId -> quiz progress

  // Session
  hearts: number; // 0–3, used in unit quiz only
  weeklyXP: number; // resets each Sunday
  weeklyXPResetDate: string; // ISO date of last reset

  // Derived helpers
  getDueReviews: () => string[]; // lessonIds due for review
  isUnitQuizUnlocked: (unitId: string) => boolean;
  canRetakeQuizToday: (unitId: string) => boolean;

  // Actions
  markContentRead: (lessonId: string) => void;
  completePractice: (lessonId: string) => void;
  completeUnitQuiz: (unitId: string, score: number, outOf: number) => void;
  loseHeart: () => void;
  resetHearts: () => void;
  checkAndUpdateStreak: () => void;
  useStreakFreeze: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

const STORAGE_KEY = 'engineeriq_state';
const REVIEW_INTERVAL_DAYS = 3;
const PRACTICE_XP = 10;

function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

function getSundayBefore(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
}

function quizXpForScore(score: number, outOf: number, isRetake: boolean): number {
  const ratio = score / outOf;
  if (isRetake) return ratio >= 0.5 ? 50 : 0;
  if (ratio === 1 || (outOf === 10 && score >= 8)) return 100;
  if (ratio >= 0.7) return 75;
  if (ratio >= 0.5) return 50;
  return 0;
}

/** Compute which lessons should be unlocked given current completion state */
function computeProgress(
  completed: Record<string, string>
): Record<string, LessonStatus> {
  const progress: Record<string, LessonStatus> = {};
  const { UNITS } = require('../data/curriculum');

  let prevUnitComplete = true;

  for (const unit of UNITS) {
    let allPrevLessonsComplete = prevUnitComplete;

    for (let i = 0; i < unit.lessons.length; i++) {
      const lesson = unit.lessons[i];
      const isCompleted = !!completed[lesson.id];

      if (i === 0) {
        progress[lesson.id] = isCompleted
          ? 'completed'
          : allPrevLessonsComplete
          ? 'available'
          : 'locked';
      } else {
        const prevLesson = unit.lessons[i - 1];
        const prevDone = !!completed[prevLesson.id];
        progress[lesson.id] = isCompleted
          ? 'completed'
          : prevDone
          ? 'available'
          : 'locked';
      }
    }

    prevUnitComplete = unit.lessons.every((l: { id: string }) => !!completed[l.id]);
  }

  return progress;
}

const useAppStore = create<AppState>((set, get) => ({
  xp: 0,
  streak: 0,
  lastActiveDate: '',
  streakFreezeAvailable: true,
  streakFreezeUsedThisWeek: false,
  lessonProgress: computeProgress({}),
  lessonLastCompleted: {},
  lessonContentRead: {},
  unitQuizProgress: {},
  hearts: 3,
  weeklyXP: 0,
  weeklyXPResetDate: getSundayBefore(todayString()),

  getDueReviews: () => {
    const { lessonLastCompleted } = get();
    const today = todayString();
    return ALL_LESSONS.filter((lesson) => {
      const lastDone = lessonLastCompleted[lesson.id];
      if (!lastDone) return false;
      return daysBetween(lastDone, today) >= REVIEW_INTERVAL_DAYS;
    }).map((l) => l.id);
  },

  isUnitQuizUnlocked: (unitId: string) => {
    const { lessonLastCompleted } = get();
    const { UNITS } = require('../data/curriculum');
    const unit = UNITS.find((u: { id: string }) => u.id === unitId);
    if (!unit) return false;
    return unit.lessons.every((l: { id: string }) => !!lessonLastCompleted[l.id]);
  },

  canRetakeQuizToday: (unitId: string) => {
    const { unitQuizProgress } = get();
    const progress = unitQuizProgress[unitId];
    if (!progress?.passed) return false;
    const today = todayString();
    return daysBetween(progress.lastAttemptDate, today) >= 1;
  },

  markContentRead: (lessonId: string) => {
    const state = get();
    if (state.lessonContentRead[lessonId]) return; // already marked
    set({
      lessonContentRead: { ...state.lessonContentRead, [lessonId]: true },
    });
    get().saveToStorage();
  },

  completePractice: (lessonId: string) => {
    const state = get();
    const today = todayString();

    // Check if weekly XP needs reset
    const currentSunday = getSundayBefore(today);
    const weeklyXP =
      currentSunday !== state.weeklyXPResetDate
        ? PRACTICE_XP
        : state.weeklyXP + PRACTICE_XP;
    const weeklyXPResetDate =
      currentSunday !== state.weeklyXPResetDate ? currentSunday : state.weeklyXPResetDate;

    const newLastCompleted = {
      ...state.lessonLastCompleted,
      [lessonId]: today,
    };
    const newProgress = computeProgress(newLastCompleted);

    set({
      xp: state.xp + PRACTICE_XP,
      weeklyXP,
      weeklyXPResetDate,
      lessonLastCompleted: newLastCompleted,
      lessonProgress: newProgress,
      hearts: 3,
    });

    get().checkAndUpdateStreak();
    get().saveToStorage();
  },

  completeUnitQuiz: (unitId: string, score: number, outOf: number) => {
    const state = get();
    const today = todayString();
    const existing = state.unitQuizProgress[unitId];
    const isRetake = existing?.passed === true;

    const xpEarned = quizXpForScore(score, outOf, isRetake);
    const passed = score / outOf >= 0.5;

    if (!passed) {
      // Failed — reset hearts, don't save progress
      set({ hearts: 3 });
      return;
    }

    const currentSunday = getSundayBefore(today);
    const weeklyXP =
      currentSunday !== state.weeklyXPResetDate
        ? xpEarned
        : state.weeklyXP + xpEarned;
    const weeklyXPResetDate =
      currentSunday !== state.weeklyXPResetDate ? currentSunday : state.weeklyXPResetDate;

    set({
      xp: state.xp + xpEarned,
      weeklyXP,
      weeklyXPResetDate,
      hearts: 3,
      unitQuizProgress: {
        ...state.unitQuizProgress,
        [unitId]: { passed: true, score, outOf, xpAwarded: xpEarned, lastAttemptDate: today },
      },
    });

    get().checkAndUpdateStreak();
    get().saveToStorage();
  },

  loseHeart: () => {
    const { hearts } = get();
    set({ hearts: Math.max(0, hearts - 1) });
  },

  resetHearts: () => {
    set({ hearts: 3 });
  },

  checkAndUpdateStreak: () => {
    const state = get();
    const today = todayString();
    if (!state.lastActiveDate) {
      set({ streak: 1, lastActiveDate: today });
      get().saveToStorage();
      return;
    }
    const diff = daysBetween(state.lastActiveDate, today);
    if (diff === 0) {
      return;
    } else if (diff === 1) {
      set({ streak: state.streak + 1, lastActiveDate: today });
    } else if (diff === 2 && state.streakFreezeAvailable && !state.streakFreezeUsedThisWeek) {
      set({
        streak: state.streak + 1,
        lastActiveDate: today,
        streakFreezeAvailable: false,
        streakFreezeUsedThisWeek: true,
      });
    } else {
      set({ streak: 1, lastActiveDate: today });
    }
    get().saveToStorage();
  },

  useStreakFreeze: () => {
    const state = get();
    if (!state.streakFreezeAvailable) return;
    set({ streakFreezeAvailable: false, streakFreezeUsedThisWeek: true });
    get().saveToStorage();
  },

  saveToStorage: async () => {
    const state = get();
    const serializable = {
      xp: state.xp,
      streak: state.streak,
      lastActiveDate: state.lastActiveDate,
      streakFreezeAvailable: state.streakFreezeAvailable,
      streakFreezeUsedThisWeek: state.streakFreezeUsedThisWeek,
      lessonLastCompleted: state.lessonLastCompleted,
      lessonContentRead: state.lessonContentRead,
      unitQuizProgress: state.unitQuizProgress,
      weeklyXP: state.weeklyXP,
      weeklyXPResetDate: state.weeklyXPResetDate,
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.warn('Failed to save state', e);
    }
  },

  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);

      const today = todayString();
      const currentSunday = getSundayBefore(today);
      const savedSunday = getSundayBefore(saved.weeklyXPResetDate || today);
      const streakFreezeUsedThisWeek =
        currentSunday === savedSunday ? (saved.streakFreezeUsedThisWeek ?? false) : false;
      const streakFreezeAvailable = streakFreezeUsedThisWeek ? false : true;

      const newLastCompleted = saved.lessonLastCompleted ?? {};
      const newProgress = computeProgress(newLastCompleted);

      set({
        xp: saved.xp ?? 0,
        streak: saved.streak ?? 0,
        lastActiveDate: saved.lastActiveDate ?? '',
        streakFreezeAvailable,
        streakFreezeUsedThisWeek,
        lessonLastCompleted: newLastCompleted,
        lessonContentRead: saved.lessonContentRead ?? {},
        unitQuizProgress: saved.unitQuizProgress ?? {},
        lessonProgress: newProgress,
        weeklyXP: saved.weeklyXP ?? 0,
        weeklyXPResetDate: saved.weeklyXPResetDate ?? getSundayBefore(today),
      });
    } catch (e) {
      console.warn('Failed to load state', e);
    }
  },
}));

export default useAppStore;
