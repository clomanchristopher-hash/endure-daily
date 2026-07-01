// Thin localStorage wrapper. Every read/write for the app funnels through
// here so the persistence layer is a single seam to swap for Supabase later
// (see README.md "Connecting Supabase").

const PREFIX = "endure-daily:";

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — fail silently, app still works in-memory.
  }
}

export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function yesterdayKey(date: Date = new Date()): string {
  const y = new Date(date);
  y.setDate(y.getDate() - 1);
  return todayKey(y);
}
