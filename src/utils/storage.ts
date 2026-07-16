// LevelOne — localStorage persistence
// A single storage key holds the entire AppData object as JSON. This keeps reads/writes
// atomic and simple, and makes export/import trivial (it's the same shape as the file on disk).

import { AppData } from '../types';
import { emptyAppData } from './calculations';

const STORAGE_KEY = 'arise_data_v1';

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAppData();
    const parsed = JSON.parse(raw) as AppData;
    // Guard against a malformed/partial object (e.g. from a hand-edited import).
    return {
      profile: parsed.profile ?? null,
      weightLogs: parsed.weightLogs ?? [],
      workoutLogs: parsed.workoutLogs ?? {},
      checklists: parsed.checklists ?? {},
      habits: parsed.habits ?? [],
      foodEntries: parsed.foodEntries ?? [],
      waterLogs: parsed.waterLogs ?? {},
      waterGoalMl: parsed.waterGoalMl ?? 2000,
    };
  } catch {
    return emptyAppData();
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Triggers a browser download of the current data as a formatted JSON file. */
export function exportDataAsFile(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `arise-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Parses an imported JSON file's text content into AppData, throwing on invalid shape. */
export function parseImportedData(text: string): AppData {
  const parsed = JSON.parse(text);
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Invalid file: not a JSON object.');
  }
  if (!parsed.profile || typeof parsed.profile.name !== 'string') {
    throw new Error('Invalid file: missing profile data.');
  }
  return {
    profile: parsed.profile,
    weightLogs: Array.isArray(parsed.weightLogs) ? parsed.weightLogs : [],
    workoutLogs: typeof parsed.workoutLogs === 'object' ? parsed.workoutLogs : {},
    checklists: typeof parsed.checklists === 'object' ? parsed.checklists : {},
    habits: Array.isArray(parsed.habits) ? parsed.habits : [],
    foodEntries: Array.isArray(parsed.foodEntries) ? parsed.foodEntries : [],
    waterLogs: typeof parsed.waterLogs === 'object' ? parsed.waterLogs : {},
    waterGoalMl: typeof parsed.waterGoalMl === 'number' ? parsed.waterGoalMl : 2000,
  };
}
