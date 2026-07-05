"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DailyProgress,
  Devotion,
  JournalEntry,
  OnboardingData,
  StrengthProgress,
  UserMode,
  UserProfile,
} from "@/types";
import { devotions as seedDevotions } from "@/lib/data/devotions";
import { ACTIVITY_STORAGE_KEY } from "@/lib/data/activities";
import { getStrengthPlanById } from "@/lib/data/strength";
import { readJSON, todayKey, writeJSON, yesterdayKey } from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

const PROFILE_KEY = "profile";
const JOURNAL_KEY = "journal";
const DEVOTION_OVERRIDES_KEY = "devotion-overrides";
const DEVOTION_DELETED_KEY = "devotion-deleted-ids";
const DAILY_PROGRESS_HISTORY_KEY = "daily-progress-history";
const DAILY_REFLECTIONS_KEY = "daily-reflections";
const CELEBRATION_KEY = "celebration-shown-date";
const ONBOARDING_KEY = "onboarding";
const STRENGTH_PROGRESS_KEY = "strength-progress";

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

const defaultProgress: DailyProgress = {
  scripture: false,
  devotion: false,
  prayer: false,
  workout: false,
};

const defaultOnboarding: OnboardingData = {
  completed: false,
  focuses: [],
  rhythm: null,
  custom_time: null,
  preferred_activity: null,
};

const defaultStrengthProgress: StrengthProgress = {
  plan_id: null,
  start_date: null,
  current_week: 1,
  current_day: 1,
  completed_workouts: [],
  last_completed_date: null,
};

// Checklist history keyed by day (yyyy-mm-dd). Today derives from it, and it
// resets automatically each day because a fresh day simply has no entry yet.
type ProgressHistory = Record<string, DailyProgress>;

interface StreakFields {
  streak: number;
  longest_streak: number;
  last_visit_date: string;
}

function reconcileStreak(
  streak: number,
  longest: number,
  lastVisit: string | null,
  today: string,
  yesterday: string
): StreakFields {
  let next: number;
  if (lastVisit === today) next = streak || 1;
  else if (lastVisit === yesterday) next = streak + 1;
  else next = 1;
  return {
    streak: next,
    longest_streak: Math.max(longest, next),
    last_visit_date: today,
  };
}

interface AppStateValue {
  ready: boolean;
  profile: UserProfile;
  devotions: Devotion[];
  journalEntries: JournalEntry[];
  dailyProgress: DailyProgress;
  dailyReflections: Record<string, string>;
  totalDevotionDays: number;
  totalWorkouts: number;
  allProgressComplete: boolean;
  celebrationSeenToday: boolean;
  markCelebrationSeen: () => void;
  onboarding: OnboardingData;
  completeOnboarding: (payload: {
    name: string;
    mode: UserMode;
    activity: string;
    focuses: string[];
    rhythm: OnboardingData["rhythm"];
    customTime: string | null;
  }) => void;
  resetOnboarding: () => void;
  strengthProgress: StrengthProgress;
  startStrengthPlan: (planId: string) => void;
  leaveStrengthPlan: () => void;
  completeStrengthWorkout: () => void;
  toggleDailyProgress: (key: keyof DailyProgress) => void;
  saveDailyReflection: (date: string, text: string) => void;
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
  const { user, configured } = useAuth();
  const uid = user?.id ?? null;
  const syncing = configured && !!uid && !!supabase;

  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [overrides, setOverrides] = useState<Record<string, Devotion>>({});
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [progressHistory, setProgressHistory] = useState<ProgressHistory>({});
  const [dailyReflections, setDailyReflections] = useState<Record<string, string>>({});
  const [celebrationDate, setCelebrationDate] = useState<string | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingData>(defaultOnboarding);
  const [strengthProgress, setStrengthProgress] =
    useState<StrengthProgress>(defaultStrengthProgress);

  // ---- Remote sync helpers (no-ops unless signed in + configured) ----------

  const remoteUpsertProfile = useCallback(
    (p: UserProfile) => {
      if (!syncing || !supabase || !uid) return;
      void supabase
        .from("profiles")
        .upsert({
          id: uid,
          display_name: p.display_name,
          mode: p.mode,
          streak: p.streak,
          longest_streak: p.longest_streak,
          last_visit_date: p.last_visit_date,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.warn("Profile sync failed:", error.message);
        });
    },
    [syncing, uid]
  );

  const remoteSetFavorite = useCallback(
    (devotionId: string, on: boolean) => {
      if (!syncing || !supabase || !uid) return;
      const query = on
        ? supabase.from("favorites").upsert({ user_id: uid, devotion_id: devotionId })
        : supabase.from("favorites").delete().eq("user_id", uid).eq("devotion_id", devotionId);
      void query.then(({ error }) => {
        if (error) console.warn("Favorite sync failed:", error.message);
      });
    },
    [syncing, uid]
  );

  const remoteUpsertProgress = useCallback(
    (date: string, prog: DailyProgress) => {
      if (!syncing || !supabase || !uid) return;
      void supabase
        .from("daily_progress")
        .upsert({ user_id: uid, date, ...prog, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) console.warn("Progress sync failed:", error.message);
        });
    },
    [syncing, uid]
  );

  const remoteUpsertReflection = useCallback(
    (date: string, content: string) => {
      if (!syncing || !supabase || !uid) return;
      void supabase
        .from("reflections")
        .upsert({ user_id: uid, date, content, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) console.warn("Reflection sync failed:", error.message);
        });
    },
    [syncing, uid]
  );

  // ---- Initial load: localStorage (fast + offline fallback) ----------------

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storedProfile = readJSON<UserProfile>(PROFILE_KEY, defaultProfile);
    const storedJournal = readJSON<JournalEntry[]>(JOURNAL_KEY, []);
    const storedOverrides = readJSON<Record<string, Devotion>>(DEVOTION_OVERRIDES_KEY, {});
    const storedDeleted = readJSON<string[]>(DEVOTION_DELETED_KEY, []);
    const storedHistory = readJSON<ProgressHistory>(DAILY_PROGRESS_HISTORY_KEY, {});
    const storedReflections = readJSON<Record<string, string>>(DAILY_REFLECTIONS_KEY, {});

    const today = todayKey();
    const yesterday = yesterdayKey();
    const streak = reconcileStreak(
      storedProfile.streak,
      storedProfile.longest_streak,
      storedProfile.last_visit_date,
      today,
      yesterday
    );
    const reconciled: UserProfile = { ...storedProfile, ...streak };

    setProfile(reconciled);
    setJournalEntries(storedJournal);
    setOverrides(storedOverrides);
    setDeletedIds(storedDeleted);
    setProgressHistory(storedHistory);
    setDailyReflections(storedReflections);
    setCelebrationDate(readJSON<string | null>(CELEBRATION_KEY, null));
    setOnboarding(readJSON<OnboardingData>(ONBOARDING_KEY, defaultOnboarding));
    setStrengthProgress(
      readJSON<StrengthProgress>(STRENGTH_PROGRESS_KEY, defaultStrengthProgress)
    );
    writeJSON(PROFILE_KEY, reconciled);
    setReady(true);
  }, []);

  // ---- When signed in: hydrate from Supabase, mirror to localStorage -------

  useEffect(() => {
    if (!syncing || !supabase || !uid) return;
    let cancelled = false;

    (async () => {
      try {
        const [profRes, favRes, progRes, reflRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
          supabase.from("favorites").select("devotion_id").eq("user_id", uid),
          supabase.from("daily_progress").select("*").eq("user_id", uid),
          supabase.from("reflections").select("date, content").eq("user_id", uid),
        ]);
        if (cancelled) return;

        const remote = profRes.data as
          | { display_name: string; mode: UserMode; streak: number; longest_streak: number; last_visit_date: string | null }
          | null;
        const favorites = ((favRes.data as { devotion_id: string }[] | null) ?? []).map(
          (r) => r.devotion_id
        );
        const history: ProgressHistory = {};
        ((progRes.data as ({ date: string } & DailyProgress)[] | null) ?? []).forEach((r) => {
          history[r.date] = {
            scripture: r.scripture,
            devotion: r.devotion,
            prayer: r.prayer,
            workout: r.workout,
          };
        });
        const reflections: Record<string, string> = {};
        ((reflRes.data as { date: string; content: string }[] | null) ?? []).forEach((r) => {
          reflections[r.date] = r.content;
        });

        const today = todayKey();
        const yesterday = yesterdayKey();
        const streak = reconcileStreak(
          remote?.streak ?? 0,
          remote?.longest_streak ?? 0,
          remote?.last_visit_date ?? null,
          today,
          yesterday
        );

        let merged: UserProfile = defaultProfile;
        setProfile((prev) => {
          merged = {
            ...prev, // keep local-only plan data
            display_name: remote?.display_name ?? prev.display_name,
            mode: remote?.mode ?? prev.mode,
            favorites,
            ...streak,
          };
          return merged;
        });
        writeJSON(PROFILE_KEY, merged);
        setProgressHistory(history);
        writeJSON(DAILY_PROGRESS_HISTORY_KEY, history);
        setDailyReflections(reflections);
        writeJSON(DAILY_REFLECTIONS_KEY, reflections);

        // Create the profile row if missing and persist the reconciled streak.
        await supabase.from("profiles").upsert({
          id: uid,
          display_name: merged.display_name,
          mode: merged.mode,
          streak: merged.streak,
          longest_streak: merged.longest_streak,
          last_visit_date: merged.last_visit_date,
          updated_at: new Date().toISOString(),
        });
      } catch {
        // Network/DB unavailable — keep the localStorage data we already loaded.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [syncing, uid]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // ---- Mutators ------------------------------------------------------------

  // All mutators below use functional state updaters so rapid successive taps
  // (e.g. checking two checklist items quickly) don't clobber each other via a
  // stale closure. Local + remote persistence happen off the freshly computed
  // next value.

  const setMode = useCallback(
    (mode: UserMode) => {
      setProfile((prev) => {
        const next = { ...prev, mode };
        writeJSON(PROFILE_KEY, next);
        remoteUpsertProfile(next);
        return next;
      });
    },
    [remoteUpsertProfile]
  );

  const updateDisplayName = useCallback(
    (name: string) => {
      setProfile((prev) => {
        const next = { ...prev, display_name: name };
        writeJSON(PROFILE_KEY, next);
        remoteUpsertProfile(next);
        return next;
      });
    },
    [remoteUpsertProfile]
  );

  const isFavorite = useCallback(
    (devotionId: string) => profile.favorites.includes(devotionId),
    [profile.favorites]
  );

  const toggleFavorite = useCallback(
    (devotionId: string) => {
      setProfile((prev) => {
        const has = prev.favorites.includes(devotionId);
        const favorites = has
          ? prev.favorites.filter((id) => id !== devotionId)
          : [...prev.favorites, devotionId];
        const next = { ...prev, favorites };
        writeJSON(PROFILE_KEY, next);
        remoteSetFavorite(devotionId, !has);
        return next;
      });
    },
    [remoteSetFavorite]
  );

  const setActivePlan = useCallback((planId: string | null) => {
    // Plans are local-only for now.
    setProfile((prev) => {
      const next = { ...prev, active_plan_id: planId };
      writeJSON(PROFILE_KEY, next);
      return next;
    });
  }, []);

  const markPlanDayComplete = useCallback((planId: string) => {
    setProfile((prev) => {
      const current = prev.plan_progress[planId] ?? 0;
      const next = {
        ...prev,
        plan_progress: { ...prev.plan_progress, [planId]: current + 1 },
      };
      writeJSON(PROFILE_KEY, next);
      return next;
    });
  }, []);

  const toggleDailyProgress = useCallback(
    (key: keyof DailyProgress) => {
      const today = todayKey();
      setProgressHistory((prev) => {
        const current = prev[today] ?? defaultProgress;
        const nextProg = { ...current, [key]: !current[key] };
        const next = { ...prev, [today]: nextProg };
        writeJSON(DAILY_PROGRESS_HISTORY_KEY, next);
        remoteUpsertProgress(today, nextProg);
        return next;
      });
    },
    [remoteUpsertProgress]
  );

  const saveDailyReflection = useCallback(
    (date: string, text: string) => {
      setDailyReflections((prev) => {
        const next = { ...prev, [date]: text };
        writeJSON(DAILY_REFLECTIONS_KEY, next);
        remoteUpsertReflection(date, text);
        return next;
      });
    },
    [remoteUpsertReflection]
  );

  // Local-only UI flag so the daily completion celebration shows once per day.
  const markCelebrationSeen = useCallback(() => {
    const today = todayKey();
    setCelebrationDate(today);
    writeJSON(CELEBRATION_KEY, today);
  }, []);

  const completeOnboarding = useCallback<AppStateValue["completeOnboarding"]>(
    (payload) => {
      // Name + movement lane live on the profile; write both in one update.
      setProfile((prev) => {
        const next = { ...prev, display_name: payload.name, mode: payload.mode };
        writeJSON(PROFILE_KEY, next);
        remoteUpsertProfile(next);
        return next;
      });
      // Preferred activity feeds Today's Assignment on the Move tab.
      writeJSON(ACTIVITY_STORAGE_KEY, payload.activity);

      const data: OnboardingData = {
        completed: true,
        focuses: payload.focuses,
        rhythm: payload.rhythm,
        custom_time: payload.customTime,
        preferred_activity: payload.activity,
      };
      setOnboarding(data);
      writeJSON(ONBOARDING_KEY, data);
    },
    [remoteUpsertProfile]
  );

  const resetOnboarding = useCallback(() => {
    setOnboarding(defaultOnboarding);
    writeJSON(ONBOARDING_KEY, defaultOnboarding);
  }, []);

  // ---- Strength Journeys (Part 6: local-first; TODO Supabase sync) ---------

  const startStrengthPlan = useCallback((planId: string) => {
    const next: StrengthProgress = {
      plan_id: planId,
      start_date: todayKey(),
      current_week: 1,
      current_day: 1,
      completed_workouts: [],
      last_completed_date: null,
    };
    setStrengthProgress(next);
    writeJSON(STRENGTH_PROGRESS_KEY, next);
    // TODO(supabase): persist the selected plan + start date for the signed-in user.
  }, []);

  const leaveStrengthPlan = useCallback(() => {
    setStrengthProgress(defaultStrengthProgress);
    writeJSON(STRENGTH_PROGRESS_KEY, defaultStrengthProgress);
    // TODO(supabase): clear the user's active strength plan.
  }, []);

  const completeStrengthWorkout = useCallback(() => {
    // Advance the week/day pointer and record the completed workout.
    setStrengthProgress((prev) => {
      if (!prev.plan_id) return prev;
      const plan = getStrengthPlanById(prev.plan_id);
      if (!plan) return prev;
      const key = `w${prev.current_week}d${prev.current_day}`;
      let nextDay = prev.current_day + 1;
      let nextWeek = prev.current_week;
      if (nextDay > plan.days_per_week) {
        nextDay = 1;
        nextWeek = prev.current_week + 1;
      }
      const next: StrengthProgress = {
        ...prev,
        completed_workouts: prev.completed_workouts.includes(key)
          ? prev.completed_workouts
          : [...prev.completed_workouts, key],
        last_completed_date: todayKey(),
        current_week: nextWeek,
        current_day: nextDay,
      };
      writeJSON(STRENGTH_PROGRESS_KEY, next);
      // TODO(supabase): upsert completed workout + week/day pointer for the user.
      return next;
    });

    // Connect to Today's Progress — mark the Workout item done (idempotent).
    const today = todayKey();
    setProgressHistory((prev) => {
      const current = prev[today] ?? defaultProgress;
      if (current.workout) return prev;
      const nextProg = { ...current, workout: true };
      const next = { ...prev, [today]: nextProg };
      writeJSON(DAILY_PROGRESS_HISTORY_KEY, next);
      remoteUpsertProgress(today, nextProg);
      return next;
    });
  }, [remoteUpsertProgress]);

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
  const dailyProgress = progressHistory[todayKey()] ?? defaultProgress;
  const totalDevotionDays = useMemo(
    () => Object.values(progressHistory).filter((p) => p.devotion).length,
    [progressHistory]
  );
  const totalWorkouts = useMemo(
    () => Object.values(progressHistory).filter((p) => p.workout).length,
    [progressHistory]
  );
  const allProgressComplete =
    dailyProgress.scripture &&
    dailyProgress.devotion &&
    dailyProgress.prayer &&
    dailyProgress.workout;
  const celebrationSeenToday = celebrationDate === todayKey();

  const value: AppStateValue = {
    ready,
    profile,
    devotions,
    journalEntries,
    dailyProgress,
    dailyReflections,
    totalDevotionDays,
    totalWorkouts,
    allProgressComplete,
    celebrationSeenToday,
    markCelebrationSeen,
    onboarding,
    completeOnboarding,
    resetOnboarding,
    strengthProgress,
    startStrengthPlan,
    leaveStrengthPlan,
    completeStrengthWorkout,
    toggleDailyProgress,
    saveDailyReflection,
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
