// ARISE — core data model
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
