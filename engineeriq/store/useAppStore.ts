import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALL_LESSONS } from '../data/curriculum';

export type LessonStatus = 'locked' | 'available' | 'completed';

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

  // Session
  hearts: number; // 0–3, resets each lesson
  weeklyXP: number; // resets each Sunday
  weeklyXPResetDate: string; // ISO date of last reset

  // Derived helpers
  getDueReviews: () => string[]; // lessonIds due for review

  // Actions
  completeLesson: (lessonId: string, perfect: boolean) => void;
  loseHeart: () => void;
  resetHearts: () => void;
  checkAndUpdateStreak: () => void;
  useStreakFreeze: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

const STORAGE_KEY = 'engineeriq_state';
const REVIEW_INTERVAL_DAYS = 3;

function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

function isSunday(dateStr: string): boolean {
  return new Date(dateStr).getDay() === 0;
}

function getSundayBefore(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
}

/** Compute which lessons should be unlocked given current completion state */
function computeProgress(
  completed: Record<string, string>
): Record<string, LessonStatus> {
  const progress: Record<string, LessonStatus> = {};

  // Import here to avoid circular module issues — we need the full lesson order
  const { UNITS } = require('../data/curriculum');

  let prevUnitComplete = true; // First unit starts unlocked

  for (const unit of UNITS) {
    let allPrevLessonsComplete = prevUnitComplete;

    for (let i = 0; i < unit.lessons.length; i++) {
      const lesson = unit.lessons[i];
      const isCompleted = !!completed[lesson.id];

      if (i === 0) {
        // First lesson of unit: available if previous unit complete
        progress[lesson.id] = isCompleted
          ? 'completed'
          : allPrevLessonsComplete
          ? 'available'
          : 'locked';
      } else {
        // Subsequent lessons: available if previous lesson complete
        const prevLesson = unit.lessons[i - 1];
        const prevDone = !!completed[prevLesson.id];
        progress[lesson.id] = isCompleted
          ? 'completed'
          : prevDone
          ? 'available'
          : 'locked';
      }
    }

    // A unit is "fully complete" if all its lessons are completed
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

  completeLesson: (lessonId: string, perfect: boolean) => {
    const state = get();
    const today = todayString();
    const xpEarned = perfect ? 30 : 20;

    // Check if weekly XP needs reset
    const currentSunday = getSundayBefore(today);
    const weeklyXP =
      currentSunday !== state.weeklyXPResetDate ? xpEarned : state.weeklyXP + xpEarned;
    const weeklyXPResetDate =
      currentSunday !== state.weeklyXPResetDate ? currentSunday : state.weeklyXPResetDate;

    const newLastCompleted = {
      ...state.lessonLastCompleted,
      [lessonId]: today,
    };

    const newProgress = computeProgress(newLastCompleted);

    set({
      xp: state.xp + xpEarned,
      weeklyXP,
      weeklyXPResetDate,
      lessonLastCompleted: newLastCompleted,
      lessonProgress: newProgress,
      hearts: 3,
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
      // Already counted today
      return;
    } else if (diff === 1) {
      set({ streak: state.streak + 1, lastActiveDate: today });
    } else if (diff === 2 && state.streakFreezeAvailable && !state.streakFreezeUsedThisWeek) {
      // Streak freeze protects a single missed day
      set({
        streak: state.streak + 1,
        lastActiveDate: today,
        streakFreezeAvailable: false,
        streakFreezeUsedThisWeek: true,
      });
    } else {
      // Streak broken
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

      // Reset weekly freeze if a new week has started
      const today = todayString();
      const currentSunday = getSundayBefore(today);
      const savedSunday = getSundayBefore(saved.weeklyXPResetDate || today);
      const streakFreezeUsedThisWeek =
        currentSunday === savedSunday ? (saved.streakFreezeUsedThisWeek ?? false) : false;
      const streakFreezeAvailable = streakFreezeUsedThisWeek
        ? false
        : true;

      const newLastCompleted = saved.lessonLastCompleted ?? {};
      const newProgress = computeProgress(newLastCompleted);

      set({
        xp: saved.xp ?? 0,
        streak: saved.streak ?? 0,
        lastActiveDate: saved.lastActiveDate ?? '',
        streakFreezeAvailable,
        streakFreezeUsedThisWeek,
        lessonLastCompleted: newLastCompleted,
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
