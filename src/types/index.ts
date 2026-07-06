// Core domain types for Endure Daily.
// These map 1:1 to the future Supabase table shapes (see README "Supabase migration").

export type UserMode = "leisure" | "athlete";

export interface Devotion {
  id: string;
  title: string;
  theme: string;
  scripture_reference: string;
  scripture_text: string;
  devotion_text: string;
  prayer: string;
  reflection_question: string;
  leisure_challenge: string;
  athlete_challenge: string;
  tags: string[];
}

export type PlanCategory = "leisure" | "athlete" | "both";

export interface Plan {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration_days: number;
  category: PlanCategory;
  devotion_ids: string[];
  premium: boolean;
}

export interface JournalEntry {
  id: string;
  devotion_id: string | null;
  devotion_title: string | null;
  date: string; // yyyy-mm-dd
  content: string;
  created_at: string; // ISO timestamp
  // "reflection" = auto-synced from Today's Reflection (one per day, read-only
  // in the Journal). Absent/"manual" = user-created journal entry.
  source?: "reflection" | "manual";
}

// ---- Movement Journeys (Running + Strength) --------------------------------

export type JourneyCategory = "running" | "strength";
export type JourneyLevel = "foundation" | "challenge";
// Access tier. Free previews are startable now; premium is visible but locked.
// TODO(premium): gate "premium" behind real subscription/entitlement checks
// once payments exist. For now premium simply means locked / Coming Soon.
export type JourneyAccess = "free" | "premium";

export interface JourneyExercise {
  name: string;
  scheme: string; // e.g. "3 sets of 8–10"
}

export interface JourneyDay {
  day: number; // 1-based day within the week
  title: string;
  purpose: string;
  workout_text?: string; // simple prose workout (running / rest / mobility)
  exercises?: JourneyExercise[]; // structured list (strength)
  faith_focus: string;
  is_rest?: boolean; // rest day — no timer, just mark complete
  timer_kind: "countdown" | "countup";
  timer_seconds: number | null; // for countdown
}

export interface MovementJourney {
  id: string;
  category: JourneyCategory;
  title: string;
  description: string;
  level: JourneyLevel;
  access: JourneyAccess;
  duration_weeks: number;
  distance?: string; // running only, e.g. "5K"
  // One-week schedule. Populated for free previews; empty for locked premium
  // plans (their guided content ships with the paid release).
  days: JourneyDay[];
}

// Local progress for an active Movement Journey. The week/day pointer advances
// as the user completes each day.
export interface JourneyProgress {
  plan_id: string | null;
  category: JourneyCategory | null;
  start_date: string | null; // yyyy-mm-dd
  current_week: number; // 1-based
  current_day: number; // 1-based day within the week
  completed_workouts: string[]; // keys like "w1d1"
  last_completed_date: string | null; // yyyy-mm-dd of the most recent completion
}

// Self-reported daily checklist on the Home screen. Resets each new day.
export interface DailyProgress {
  scripture: boolean;
  devotion: boolean;
  prayer: boolean;
  workout: boolean;
}

export const DAILY_PROGRESS_ITEMS: { key: keyof DailyProgress; label: string }[] = [
  { key: "scripture", label: "Read Scripture" },
  { key: "devotion", label: "Read Devotion" },
  { key: "prayer", label: "Prayer Time" },
  { key: "workout", label: "Workout Complete" },
];

export type DailyRhythm = "morning" | "afternoon" | "evening" | "custom";

// First-run personalization. Name + mode live on the profile; this stores the
// extra answers and the completed flag that gates the onboarding flow.
export interface OnboardingData {
  completed: boolean;
  focuses: string[];
  rhythm: DailyRhythm | null;
  custom_time: string | null; // "HH:MM" when rhythm === "custom"
  preferred_activity: string | null; // walk | run | gym | recovery
}

export interface UserProfile {
  display_name: string;
  mode: UserMode;
  streak: number;
  longest_streak: number;
  last_visit_date: string | null; // yyyy-mm-dd
  favorites: string[]; // devotion ids
  active_plan_id: string | null;
  plan_progress: Record<string, number>; // plan_id -> days completed
}
