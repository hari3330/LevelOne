// LevelOne — global app data context
// Single source of truth for the app's persisted state. Every mutation goes through here so
// that localStorage and in-memory React state never drift apart.

import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  AppData,
  DailyChecklist,
  FoodEntry,
  FoodUnit,
  Habit,
  MealType,
  Profile,
  WeightLog,
  WorkoutLog,
  EMPTY_CHECKLIST,
} from '../types';
import { loadData, saveData, clearData } from '../utils/storage';
import { todayISO } from '../utils/dateUtils';
import { calcCurrentStreak, generateHabitId } from '../utils/habitCalculations';
import { generateFoodEntryId, scaleNutrition } from '../utils/nutritionCalculations';

interface AppDataContextValue {
  data: AppData;
  /** Completes first-time setup and starts the challenge. */
  createProfile: (profile: Profile) => void;
  updateProfile: (partial: Partial<Profile>) => void;
  /** Toggles one of today's six missions. */
  toggleChecklistItem: (key: keyof DailyChecklist, date?: string) => void;
  /** Fetches (or creates a blank) checklist for a given date, defaulting to today. */
  getChecklist: (date?: string) => DailyChecklist;
  saveWorkoutLog: (log: WorkoutLog, date?: string) => void;
  getWorkoutLog: (date?: string) => WorkoutLog | undefined;
  /** Adds or updates today's weight entry (one entry per day). */
  logWeight: (weight: number, date?: string) => void;
  resetChallenge: () => void;
  replaceAllData: (next: AppData) => void;

  // --- Discipline / habit tracking (added; does not affect any existing behavior) ---
  addHabit: (input: { name: string; quitDate: string; notes: string }) => void;
  updateHabit: (id: string, partial: { name: string; quitDate: string; notes: string }) => void;
  deleteHabit: (id: string) => void;
  relapseHabit: (id: string) => void;

  // --- Nutrition (added; does not affect any existing behavior) ---
  addFoodEntry: (input: {
    mealType: MealType;
    foodName: string;
    brand?: string;
    quantity: number;
    unit: FoodUnit;
    caloriesPer100: number;
    proteinPer100: number;
    carbsPer100: number;
    fatPer100: number;
    date?: string;
  }) => void;
  updateFoodEntry: (id: string, partial: { quantity: number; unit: FoodUnit; mealType: MealType }) => void;
  deleteFoodEntry: (id: string) => void;
  addWater: (deltaMl: number, date?: string) => void;
  setWaterGoal: (ml: number) => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());

  // Persist to localStorage on every change, and update in-memory state together.
  function update(next: AppData) {
    setData(next);
    saveData(next);
  }

  const value = useMemo<AppDataContextValue>(
    () => ({
      data,

      createProfile(profile) {
        update({ ...data, profile });
      },

      updateProfile(partial) {
        if (!data.profile) return;
        update({ ...data, profile: { ...data.profile, ...partial } });
      },

      toggleChecklistItem(key, date = todayISO()) {
        const current = data.checklists[date] ?? { ...EMPTY_CHECKLIST };
        const updated: DailyChecklist = { ...current, [key]: !current[key] };
        update({ ...data, checklists: { ...data.checklists, [date]: updated } });
      },

      getChecklist(date = todayISO()) {
        return data.checklists[date] ?? { ...EMPTY_CHECKLIST };
      },

      saveWorkoutLog(log, date = todayISO()) {
        const checklist = data.checklists[date] ?? { ...EMPTY_CHECKLIST };
        update({
          ...data,
          workoutLogs: { ...data.workoutLogs, [date]: log },
          // A saved workout log keeps today's "Workout Completed" mission in sync.
          checklists: { ...data.checklists, [date]: { ...checklist, workout: log.done } },
        });
      },

      getWorkoutLog(date = todayISO()) {
        return data.workoutLogs[date];
      },

      logWeight(weight, date = todayISO()) {
        const existingIndex = data.weightLogs.findIndex((w) => w.date === date);
        const nextLogs: WeightLog[] = [...data.weightLogs];
        if (existingIndex >= 0) {
          nextLogs[existingIndex] = { date, weight };
        } else {
          nextLogs.push({ date, weight });
        }
        nextLogs.sort((a, b) => (a.date < b.date ? -1 : 1));
        update({ ...data, weightLogs: nextLogs });
      },

      resetChallenge() {
        clearData();
        setData(loadData());
      },

      replaceAllData(next) {
        update(next);
      },

      // --- Discipline / habit tracking ---

      addHabit({ name, quitDate, notes }) {
        const habit: Habit = {
          id: generateHabitId(),
          name: name.trim(),
          quitDate,
          notes: notes.trim(),
          relapseDates: [],
          longestStreakSaved: 0,
        };
        update({ ...data, habits: [...data.habits, habit] });
      },

      updateHabit(id, partial) {
        const habits = data.habits.map((h) =>
          h.id === id
            ? { ...h, name: partial.name.trim(), quitDate: partial.quitDate, notes: partial.notes.trim() }
            : h
        );
        update({ ...data, habits });
      },

      deleteHabit(id) {
        update({ ...data, habits: data.habits.filter((h) => h.id !== id) });
      },

      relapseHabit(id) {
        const today = todayISO();
        const habits = data.habits.map((h) => {
          if (h.id !== id) return h;
          const streakBeforeRelapse = calcCurrentStreak(h);
          return {
            ...h,
            longestStreakSaved: Math.max(h.longestStreakSaved, streakBeforeRelapse),
            relapseDates: [...h.relapseDates, today],
          };
        });
        update({ ...data, habits });
      },

      // --- Nutrition ---

      addFoodEntry({ mealType, foodName, brand, quantity, unit, caloriesPer100, proteinPer100, carbsPer100, fatPer100, date = todayISO() }) {
        const totals = scaleNutrition({ caloriesPer100, proteinPer100, carbsPer100, fatPer100 }, quantity, unit);
        const entry: FoodEntry = {
          id: generateFoodEntryId(),
          date,
          mealType,
          foodName,
          brand,
          quantity,
          unit,
          caloriesPer100,
          proteinPer100,
          carbsPer100,
          fatPer100,
          ...totals,
        };
        update({ ...data, foodEntries: [...data.foodEntries, entry] });
      },

      updateFoodEntry(id, { quantity, unit, mealType }) {
        const foodEntries = data.foodEntries.map((f) => {
          if (f.id !== id) return f;
          const totals = scaleNutrition(f, quantity, unit);
          return { ...f, quantity, unit, mealType, ...totals };
        });
        update({ ...data, foodEntries });
      },

      deleteFoodEntry(id) {
        update({ ...data, foodEntries: data.foodEntries.filter((f) => f.id !== id) });
      },

      addWater(deltaMl, date = todayISO()) {
        const current = data.waterLogs[date] ?? 0;
        const next = Math.max(current + deltaMl, 0);
        update({ ...data, waterLogs: { ...data.waterLogs, [date]: next } });
      },

      setWaterGoal(ml) {
        update({ ...data, waterGoalMl: ml });
      },
    }),
    [data]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within an AppDataProvider');
  return ctx;
}
