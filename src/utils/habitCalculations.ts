// ARISE — Discipline page calculations
// Kept separate from utils/calculations.ts so the existing dashboard/progress logic
// is never touched while extending the app with habit tracking.

import { Habit } from '../types';
import { daysBetweenISO, todayISO } from './dateUtils';

export type HabitStatus = 'Active' | 'Relapsed';

/** The date the current streak counts from: the most recent relapse, or the original quit date. */
export function streakStartDate(habit: Habit): string {
  if (habit.relapseDates.length === 0) return habit.quitDate;
  return habit.relapseDates[habit.relapseDates.length - 1];
}

/** Days Clean = Today - Quit Date - Relapse Dates, recalculated automatically every day. */
export function calcCurrentStreak(habit: Habit): number {
  return Math.max(daysBetweenISO(streakStartDate(habit), todayISO()), 0);
}

/** The longest streak ever reached, including today's still-running streak if it's a new record. */
export function calcLongestStreak(habit: Habit): number {
  return Math.max(habit.longestStreakSaved, calcCurrentStreak(habit));
}

/** "Relapsed" only on the day of the relapse itself; the day after, the new streak is already "Active". */
export function calcStatus(habit: Habit): HabitStatus {
  const last = habit.relapseDates[habit.relapseDates.length - 1];
  return last === todayISO() ? 'Relapsed' : 'Active';
}

export interface DisciplineStats {
  activeHabits: number;
  totalCleanDays: number;
  longestStreak: number;
  totalRelapses: number;
}

export function calcDisciplineStats(habits: Habit[]): DisciplineStats {
  if (habits.length === 0) {
    return { activeHabits: 0, totalCleanDays: 0, longestStreak: 0, totalRelapses: 0 };
  }
  const activeHabits = habits.filter((h) => calcStatus(h) === 'Active').length;
  const totalCleanDays = habits.reduce((sum, h) => sum + calcCurrentStreak(h), 0);
  const longestStreak = Math.max(...habits.map(calcLongestStreak));
  const totalRelapses = habits.reduce((sum, h) => sum + h.relapseDates.length, 0);
  return { activeHabits, totalCleanDays, longestStreak, totalRelapses };
}

/** Simple unique id generator — avoids depending on crypto.randomUUID for older browser support. */
export function generateHabitId(): string {
  return `habit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
