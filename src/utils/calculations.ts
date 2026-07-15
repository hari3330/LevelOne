// ARISE — derived calculations
// Pure functions only: given data in, a value out. Keeps components simple and testable.

import { AppData, DailyChecklist, Profile, WeightLog } from '../types';
import { addDaysISO, daysBetweenISO, todayISO } from './dateUtils';

/** Body Mass Index = weight(kg) / height(m)^2 */
export function calcBMI(weightKg: number, heightCm: number): number {
  if (!heightCm) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

export type BMICategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';

export function bmiCategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

/** The current weight is the most recent logged weight, falling back to the starting weight. */
export function getCurrentWeight(profile: Profile, weightLogs: WeightLog[]): number {
  if (weightLogs.length === 0) return profile.startWeight;
  const sorted = [...weightLogs].sort((a, b) => (a.date < b.date ? -1 : 1));
  return sorted[sorted.length - 1].weight;
}

export function isChecklistComplete(checklist: DailyChecklist | undefined): boolean {
  if (!checklist) return false;
  return (
    checklist.workout &&
    checklist.calories &&
    checklist.protein &&
    checklist.steps &&
    checklist.water &&
    checklist.sleep
  );
}

/**
 * Current streak of consecutive fully-completed days, counting backward from today.
 * If today isn't finished yet, today is skipped (it doesn't break a streak in progress),
 * and counting starts from yesterday instead.
 */
export function calcStreak(checklists: Record<string, DailyChecklist>): number {
  const today = todayISO();
  let streak = 0;
  let cursor = today;

  if (!isChecklistComplete(checklists[today])) {
    cursor = addDaysISO(cursor, -1);
  }

  // Safety cap so a corrupted data set can never loop forever.
  for (let i = 0; i < 3650; i++) {
    if (isChecklistComplete(checklists[cursor])) {
      streak++;
      cursor = addDaysISO(cursor, -1);
    } else {
      break;
    }
  }
  return streak;
}

/** Which day of the challenge "today" is (1-indexed), clamped to [1, challengeLength]. */
export function currentChallengeDay(profile: Profile): number {
  const elapsed = daysBetweenISO(profile.startDate, todayISO()) + 1;
  return Math.min(Math.max(elapsed, 1), profile.challengeLength);
}

export interface WeightStats {
  currentWeight: number;
  weightLost: number;
  remaining: number;
  avgWeeklyLoss: number; // positive = losing weight, negative = gaining
  expectedFinishDate: string | null; // ISO date, or null if not enough data / not trending toward goal
}

export function calcWeightStats(profile: Profile, weightLogs: WeightLog[]): WeightStats {
  const currentWeight = getCurrentWeight(profile, weightLogs);
  const weightLost = profile.startWeight - currentWeight;
  const remaining = Math.max(currentWeight - profile.targetWeight, 0);

  const sorted = [...weightLogs].sort((a, b) => (a.date < b.date ? -1 : 1));
  let avgWeeklyLoss = 0;
  if (sorted.length >= 2) {
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const daysElapsed = Math.max(daysBetweenISO(first.date, last.date), 1);
    const totalLost = first.weight - last.weight;
    avgWeeklyLoss = totalLost / (daysElapsed / 7);
  }

  let expectedFinishDate: string | null = null;
  if (avgWeeklyLoss > 0.01 && remaining > 0) {
    const weeksNeeded = remaining / avgWeeklyLoss;
    expectedFinishDate = addDaysISO(todayISO(), Math.round(weeksNeeded * 7));
  } else if (remaining <= 0) {
    expectedFinishDate = todayISO();
  }

  return { currentWeight, weightLost, remaining, avgWeeklyLoss, expectedFinishDate };
}

export interface DayStatus {
  date: string;
  dayNumber: number; // 1-indexed
  isFuture: boolean;
  isToday: boolean;
  isComplete: boolean;
}

/** Builds the full 90-day (or however long) calendar grid data for the challenge. */
export function buildChallengeGrid(profile: Profile, checklists: Record<string, DailyChecklist>): DayStatus[] {
  const today = todayISO();
  const days: DayStatus[] = [];
  for (let i = 0; i < profile.challengeLength; i++) {
    const date = addDaysISO(profile.startDate, i);
    days.push({
      date,
      dayNumber: i + 1,
      isFuture: date > today,
      isToday: date === today,
      isComplete: isChecklistComplete(checklists[date]),
    });
  }
  return days;
}

export function calcChallengeProgress(profile: Profile, checklists: Record<string, DailyChecklist>): {
  completedDays: number;
  percentage: number;
} {
  const grid = buildChallengeGrid(profile, checklists);
  const completedDays = grid.filter((d) => d.isComplete).length;
  const percentage = Math.round((completedDays / profile.challengeLength) * 100);
  return { completedDays, percentage };
}

/** Chart-ready series: one point per logged weight entry, plus the constant target line. */
export function buildChartData(profile: Profile, weightLogs: WeightLog[]) {
  const sorted = [...weightLogs].sort((a, b) => (a.date < b.date ? -1 : 1));
  const points = sorted.length > 0 ? sorted : [{ date: profile.startDate, weight: profile.startWeight }];
  return points.map((p) => ({
    date: p.date,
    actual: p.weight,
    target: profile.targetWeight,
  }));
}

/** Default, empty app data shape used before setup / after a reset. */
export function emptyAppData(): AppData {
  return {
    profile: null,
    weightLogs: [],
    workoutLogs: {},
    checklists: {},
    habits: [],
  };
}
