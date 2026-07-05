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
}

// ---- Strength Journeys -----------------------------------------------------

export interface StrengthExercise {
  name: string;
  scheme: string; // e.g. "3 sets of 8–10"
}

export interface StrengthWorkout {
  day: number; // 1-based day within the week
  title: string; // e.g. "Upper Body Foundation"
  purpose: string;
  exercises: StrengthExercise[];
  faith_focus: string;
}

export type StrengthLane = "foundation" | "challenge";

export interface StrengthPlan {
  id: string;
  title: string;
  description: string;
  lane: StrengthLane;
  days_per_week: number;
  duration_weeks: number;
  // The one-week template; repeated each week for the plan's duration.
  workouts: StrengthWorkout[];
}

// Local progress for an active Strength Journey (Part 6). The week/day pointer
// advances as the user completes each workout.
export interface StrengthProgress {
  plan_id: string | null;
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
