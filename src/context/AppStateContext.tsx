"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Devotion, JournalEntry, UserMode, UserProfile } from "@/types";
import { devotions as seedDevotions } from "@/lib/data/devotions";
import { readJSON, todayKey, writeJSON, yesterdayKey } from "@/lib/storage";

const PROFILE_KEY = "profile";
const JOURNAL_KEY = "journal";
const DEVOTION_OVERRIDES_KEY = "devotion-overrides";
const DEVOTION_DELETED_KEY = "devotion-deleted-ids";

const defaultProfile: UserProfile = {
  display_name: "Friend",
  mode: "leisure",
  streak: 0,
  longest_streak: 0,
  last_visit_date: null,
  favorites: [],
  active_plan_id: null,
  plan_progress: {},
};

interface AppStateValue {
  ready: boolean;
  profile: UserProfile;
  devotions: Devotion[];
  journalEntries: JournalEntry[];
  setMode: (mode: UserMode) => void;
  updateDisplayName: (name: string) => void;
  isFavorite: (devotionId: string) => boolean;
  toggleFavorite: (devotionId: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "created_at">) => void;
  updateJournalEntry: (id: string, content: string) => void;
  deleteJournalEntry: (id: string) => void;
  setActivePlan: (planId: string | null) => void;
  markPlanDayComplete: (planId: string) => void;
  adminAddDevotion: (devotion: Devotion) => void;
  adminUpdateDevotion: (devotion: Devotion) => void;
  adminDeleteDevotion: (id: string) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function mergeDevotions(overrides: Record<string, Devotion>, deletedIds: string[]): Devotion[] {
  const deleted = new Set(deletedIds);
  const base = seedDevotions
    .filter((d) => !deleted.has(d.id))
    .map((d) => overrides[d.id] ?? d);
  const baseIds = new Set(seedDevotions.map((d) => d.id));
  const added = Object.values(overrides).filter((d) => !baseIds.has(d.id) && !deleted.has(d.id));
  return [...base, ...added];
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [overrides, setOverrides] = useState<Record<string, Devotion>>({});
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Load persisted state once on mount, then reconcile the daily streak.
  // localStorage isn't available during SSR, so this must run post-mount;
  // an eager useState initializer here would cause a hydration mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storedProfile = readJSON<UserProfile>(PROFILE_KEY, defaultProfile);
    const storedJournal = readJSON<JournalEntry[]>(JOURNAL_KEY, []);
    const storedOverrides = readJSON<Record<string, Devotion>>(DEVOTION_OVERRIDES_KEY, {});
    const storedDeleted = readJSON<string[]>(DEVOTION_DELETED_KEY, []);

    const today = todayKey();
    const yesterday = yesterdayKey();
    let nextStreak = storedProfile.streak;
    if (storedProfile.last_visit_date === today) {
      nextStreak = storedProfile.streak;
    } else if (storedProfile.last_visit_date === yesterday) {
      nextStreak = storedProfile.streak + 1;
    } else {
      nextStreak = 1;
    }
    const reconciled: UserProfile = {
      ...storedProfile,
      streak: nextStreak,
      longest_streak: Math.max(storedProfile.longest_streak, nextStreak),
      last_visit_date: today,
    };

    setProfile(reconciled);
    setJournalEntries(storedJournal);
    setOverrides(storedOverrides);
    setDeletedIds(storedDeleted);
    writeJSON(PROFILE_KEY, reconciled);
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const persistProfile = useCallback((next: UserProfile) => {
    setProfile(next);
    writeJSON(PROFILE_KEY, next);
  }, []);

  const setMode = useCallback(
    (mode: UserMode) => {
      persistProfile({ ...profile, mode });
    },
    [profile, persistProfile]
  );

  const updateDisplayName = useCallback(
    (name: string) => {
      persistProfile({ ...profile, display_name: name });
    },
    [profile, persistProfile]
  );

  const isFavorite = useCallback(
    (devotionId: string) => profile.favorites.includes(devotionId),
    [profile.favorites]
  );

  const toggleFavorite = useCallback(
    (devotionId: string) => {
      const has = profile.favorites.includes(devotionId);
      const favorites = has
        ? profile.favorites.filter((id) => id !== devotionId)
        : [...profile.favorites, devotionId];
      persistProfile({ ...profile, favorites });
    },
    [profile, persistProfile]
  );

  const setActivePlan = useCallback(
    (planId: string | null) => {
      persistProfile({ ...profile, active_plan_id: planId });
    },
    [profile, persistProfile]
  );

  const markPlanDayComplete = useCallback(
    (planId: string) => {
      const current = profile.plan_progress[planId] ?? 0;
      persistProfile({
        ...profile,
        plan_progress: { ...profile.plan_progress, [planId]: current + 1 },
      });
    },
    [profile, persistProfile]
  );

  const persistJournal = useCallback((entries: JournalEntry[]) => {
    setJournalEntries(entries);
    writeJSON(JOURNAL_KEY, entries);
  }, []);

  const addJournalEntry = useCallback(
    (entry: Omit<JournalEntry, "id" | "created_at">) => {
      const newEntry: JournalEntry = {
        ...entry,
        id: `journal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        created_at: new Date().toISOString(),
      };
      persistJournal([newEntry, ...journalEntries]);
    },
    [journalEntries, persistJournal]
  );

  const updateJournalEntry = useCallback(
    (id: string, content: string) => {
      persistJournal(journalEntries.map((e) => (e.id === id ? { ...e, content } : e)));
    },
    [journalEntries, persistJournal]
  );

  const deleteJournalEntry = useCallback(
    (id: string) => {
      persistJournal(journalEntries.filter((e) => e.id !== id));
    },
    [journalEntries, persistJournal]
  );

  const persistOverrides = useCallback((next: Record<string, Devotion>) => {
    setOverrides(next);
    writeJSON(DEVOTION_OVERRIDES_KEY, next);
  }, []);

  const persistDeleted = useCallback((next: string[]) => {
    setDeletedIds(next);
    writeJSON(DEVOTION_DELETED_KEY, next);
  }, []);

  const adminAddDevotion = useCallback(
    (devotion: Devotion) => {
      persistOverrides({ ...overrides, [devotion.id]: devotion });
    },
    [overrides, persistOverrides]
  );

  const adminUpdateDevotion = useCallback(
    (devotion: Devotion) => {
      persistOverrides({ ...overrides, [devotion.id]: devotion });
    },
    [overrides, persistOverrides]
  );

  const adminDeleteDevotion = useCallback(
    (id: string) => {
      const nextOverrides = { ...overrides };
      delete nextOverrides[id];
      persistOverrides(nextOverrides);
      if (!deletedIds.includes(id)) {
        persistDeleted([...deletedIds, id]);
      }
    },
    [overrides, deletedIds, persistOverrides, persistDeleted]
  );

  const devotions = useMemo(() => mergeDevotions(overrides, deletedIds), [overrides, deletedIds]);

  const value: AppStateValue = {
    ready,
    profile,
    devotions,
    journalEntries,
    setMode,
    updateDisplayName,
    isFavorite,
    toggleFavorite,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    setActivePlan,
    markPlanDayComplete,
    adminAddDevotion,
    adminUpdateDevotion,
    adminDeleteDevotion,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
