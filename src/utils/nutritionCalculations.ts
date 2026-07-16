// LevelOne — Nutrition page calculations
// Kept separate from utils/calculations.ts so existing dashboard/progress logic is
// never touched while extending the app with meal logging.

import { FoodEntry, FoodUnit, MealType, Profile } from '../types';
import { todayISO } from './dateUtils';

/** Nutrition scaled to a logged quantity, assuming values are normalized "per 100" units. */
export interface ScaledNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Scales per-100(g/ml) nutrition to a given quantity + unit.
 * "g" and "ml" both scale directly against the per-100 baseline (a reasonable
 * approximation for most whole foods and drinks). "serving" is treated as 100 units
 * per serving, so quantity is the number of servings.
 */
export function scaleNutrition(
  base: { caloriesPer100: number; proteinPer100: number; carbsPer100: number; fatPer100: number },
  quantity: number,
  unit: FoodUnit
): ScaledNutrition {
  const multiplier = unit === 'serving' ? quantity : quantity / 100;
  const round1 = (n: number) => Math.round(n * 10) / 10;
  return {
    calories: round1(base.caloriesPer100 * multiplier),
    protein: round1(base.proteinPer100 * multiplier),
    carbs: round1(base.carbsPer100 * multiplier),
    fat: round1(base.fatPer100 * multiplier),
  };
}

export interface DailyNutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function calcDailyTotals(foodEntries: FoodEntry[], date: string = todayISO()): DailyNutritionTotals {
  const todays = foodEntries.filter((f) => f.date === date);
  return todays.reduce(
    (totals, f) => ({
      calories: totals.calories + f.calories,
      protein: totals.protein + f.protein,
      carbs: totals.carbs + f.carbs,
      fat: totals.fat + f.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function entriesForMeal(foodEntries: FoodEntry[], mealType: MealType, date: string = todayISO()): FoodEntry[] {
  return foodEntries.filter((f) => f.date === date && f.mealType === mealType);
}

export function calcWaterTotal(waterLogs: Record<string, number>, date: string = todayISO()): number {
  return waterLogs[date] ?? 0;
}

/**
 * Default macro goals derived from the profile's calorie + protein goals (already
 * collected at setup) using a standard split, so carbs/fat targets exist without
 * requiring any change to the setup or settings screens.
 */
export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function calcMacroGoals(profile: Profile): MacroGoals {
  const proteinCalories = profile.proteinGoal * 4;
  const remaining = Math.max(profile.calorieGoal - proteinCalories, 0);
  // Split the remaining calories 55% carbs / 45% fat — a common, reasonable default.
  const carbs = Math.round((remaining * 0.55) / 4);
  const fat = Math.round((remaining * 0.45) / 9);
  return { calories: profile.calorieGoal, protein: profile.proteinGoal, carbs, fat };
}

export function generateFoodEntryId(): string {
  return `food_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
