// ARISE — Discipline page motivational quotes
// One quote is shown per day, deterministically chosen from the date so it never
// changes on refresh but rotates automatically at midnight.

import { fromISO, todayISO } from './dateUtils';

const QUOTES: string[] = [
  'Discipline is choosing what you want most over what you want now.',
  'Every day you don\u2019t give in, you get a little stronger.',
  'You don\u2019t have to see the whole staircase, just take the first step.',
  'The chains of habit are too weak to be felt until they are too strong to be broken.',
  'Motivation gets you started. Discipline keeps you going.',
  'A relapse is a setback, not the end of the story.',
  'Small daily improvements are the key to staggering long-term results.',
  'You are stronger than your strongest excuse.',
  'The pain of discipline weighs ounces, the pain of regret weighs tons.',
  'Progress, not perfection.',
];

function dayOfYear(iso: string): number {
  const date = fromISO(iso);
  const start = new Date(date.getFullYear(), 0, 0);
  const diffMs = date.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/** Deterministic "quote of the day" — same all day, changes tomorrow. */
export function getDailyQuote(): string {
  const index = dayOfYear(todayISO()) % QUOTES.length;
  return QUOTES[index];
}
