import { UserMode } from "@/types";

// localStorage key for the user's chosen Move activity. Shared so onboarding
// can pre-set it and the Move page reads the same value.
export const ACTIVITY_STORAGE_KEY = "assignment-activity";

export type ActivityKind = "countdown" | "countup";

export interface Activity {
  id: string;
  label: string; // short chip label
  title: string; // assignment title
  description: string; // one short line
  durationSec: number | null; // null = count-up (no set duration)
  kind: ActivityKind;
}

export const activities: Record<string, Activity> = {
  walk: {
    id: "walk",
    label: "Walk",
    title: "15 Minute Walk",
    description: "Move for 15 minutes and reflect on God's grace.",
    durationSec: 15 * 60,
    kind: "countdown",
  },
  run: {
    id: "run",
    label: "Run",
    title: "Easy Run",
    description: "Run at an easy pace and thank God for your strength.",
    durationSec: 20 * 60,
    kind: "countdown",
  },
  gym: {
    id: "gym",
    label: "Gym",
    title: "Full Body Strength",
    description: "Train with intention — your body is His temple.",
    durationSec: null,
    kind: "countup",
  },
  recovery: {
    id: "recovery",
    label: "Recovery",
    title: "Stretch & Breathe",
    description: "Stretch, breathe, and rest in His presence.",
    durationSec: 10 * 60,
    kind: "countdown",
  },
};

export const activityOrder = ["walk", "run", "gym", "recovery"];

export function defaultActivityId(mode: UserMode): string {
  return mode === "athlete" ? "run" : "walk";
}
