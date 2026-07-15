// ARISE — date helpers
// All dates in the app are stored as ISO strings "YYYY-MM-DD" (local calendar day, no time).

/** Returns today's date as an ISO "YYYY-MM-DD" string, in local time. */
export function todayISO(): string {
  return toISO(new Date());
}

/** Converts a Date object to an ISO "YYYY-MM-DD" string using local time fields. */
export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parses an ISO "YYYY-MM-DD" string into a local Date at midnight. */
export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Adds (or subtracts, if negative) whole days to an ISO date string. */
export function addDaysISO(iso: string, days: number): string {
  const date = fromISO(iso);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

/** Number of whole days between two ISO dates (b - a). */
export function daysBetweenISO(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((fromISO(b).getTime() - fromISO(a).getTime()) / msPerDay);
}

/** Friendly display date, e.g. "Tue, Jul 16". */
export function formatDisplayDate(iso: string): string {
  return fromISO(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Friendly long display date, e.g. "July 16, 2026". */
export function formatLongDate(iso: string): string {
  return fromISO(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Returns a greeting based on the current local hour. */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good Night';
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
}
