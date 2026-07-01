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
