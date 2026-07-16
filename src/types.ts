// LevelOne — core data model
// Everything the app persists to localStorage is described here.

export type WorkoutType =
  | 'Push'
  | 'Pull'
  | 'Legs'
  | 'Upper'
  | 'Lower'
  | 'Full Body'
  | 'Rest Day';

export const WORKOUT_TYPES: WorkoutType[] = [
  'Push',
  'Pull',
  'Legs',
  'Upper',
  'Lower',
  'Full Body',
  'Rest Day',
];

/** The user's profile, captured once during setup and editable in Settings. */
export interface Profile {
  name: string;
  heightCm: number;
  /** Weight on day 1 of the challenge — used to measure progress. */
  startWeight: number;
  targetWeight: number;
  challengeLength: number; // in days, default 90
  calorieGoal: number; // kcal
  proteinGoal: number; // grams
  /** ISO date string (YYYY-MM-DD) the challenge began. */
  startDate: string;
}

/** One day's workout entry, keyed by ISO date in AppData.workoutLogs. */
export interface WorkoutLog {
  done: boolean;
  type: WorkoutType | null;
  duration: number; // minutes
}

/** The six daily missions, keyed by ISO date in AppData.checklists. */
export interface DailyChecklist {
  workout: boolean;
  calories: boolean;
  protein: boolean;
  steps: boolean;
  water: boolean;
  sleep: boolean;
}

export const EMPTY_CHECKLIST: DailyChecklist = {
  workout: false,
  calories: false,
  protein: false,
  steps: false,
  water: false,
  sleep: false,
};

export interface WeightLog {
  date: string; // ISO date, one entry per day
  weight: number; // kg
}

export interface AppData {
  profile: Profile | null;
  weightLogs: WeightLog[];
  workoutLogs: Record<string, WorkoutLog>;
  checklists: Record<string, DailyChecklist>;
  habits: Habit[];
  foodEntries: FoodEntry[];
  /** ISO date -> milliliters of water logged that day. */
  waterLogs: Record<string, number>;
  waterGoalMl: number;
}

/** A habit the user is trying to quit, tracked on the Discipline page. */
export interface Habit {
  id: string;
  name: string;
  /** ISO date the habit was first quit. Fixed — never changes after creation. */
  quitDate: string;
  notes: string;
  /** ISO dates of every relapse, oldest first. The current streak counts from the most recent one. */
  relapseDates: string[];
  /** The longest streak ever achieved, as of the last relapse (today's live streak may exceed this). */
  longestStreakSaved: number;
}

export const CHECKLIST_META: {
  key: keyof DailyChecklist;
  label: string;
  description: string;
}[] = [
  { key: 'workout', label: 'Workout Completed', description: 'Finish today\u2019s training session' },
  { key: 'calories', label: 'Calories Goal Met', description: 'Stay on target with your calorie goal' },
  { key: 'protein', label: 'Protein Goal Met', description: 'Hit your daily protein target' },
  { key: 'steps', label: '10,000 Steps', description: 'Reach ten thousand steps today' },
  { key: 'water', label: 'Water Goal', description: 'Drink enough water for the day' },
  { key: 'sleep', label: 'Sleep Goal', description: 'Get a full night of restful sleep' },
];

// --- Nutrition (Nutrition page) ---

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
};

export type FoodUnit = 'g' | 'ml' | 'serving';

/**
 * One logged food entry. Stores both the per-100g/ml/serving baseline nutrition
 * (so quantity edits can be rescaled without re-searching) and the totals computed
 * for the logged quantity at save time.
 */
export interface FoodEntry {
  id: string;
  date: string; // ISO date this entry was logged for
  mealType: MealType;
  foodName: string;
  brand?: string;
  quantity: number;
  unit: FoodUnit;
  caloriesPer100: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
  // Totals for this entry's quantity — what's displayed and summed into daily totals.
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
