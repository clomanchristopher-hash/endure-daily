import { UserMode } from "@/types";

// localStorage key for the user's chosen Move activity. Shared so onboarding
// can pre-set it and the Move page reads the same value.
export const ACTIVITY_STORAGE_KEY = "assignment-activity";

export type ActivityKind = "countdown" | "countup";
// Foundation = lighter daily movement; Challenge = higher-effort movement.
export type ActivityLane = "foundation" | "challenge";

export interface Activity {
  id: string;
  label: string; // short chip label
  title: string; // assignment title
  description: string; // one short line
  durationSec: number | null; // null = count-up (no set duration)
  kind: ActivityKind;
  lane: ActivityLane;
}

export const activities: Record<string, Activity> = {
  // ---- Foundation (lighter) ----
  walk: {
    id: "walk",
    label: "Walk",
    title: "15 Minute Walk",
    description: "Move for 15 minutes and reflect on God's grace.",
    durationSec: 15 * 60,
    kind: "countdown",
    lane: "foundation",
  },
  mobility: {
    id: "mobility",
    label: "Mobility",
    title: "Recovery + Mobility",
    description: "Loosen up and restore — caring for the body He gave you.",
    durationSec: null,
    kind: "countup",
    lane: "foundation",
  },
  stretch: {
    id: "stretch",
    label: "Stretch",
    title: "Stretch & Breathe",
    description: "Stretch, breathe, and rest in His presence.",
    durationSec: 10 * 60,
    kind: "countdown",
    lane: "foundation",
  },
  "beginner-strength": {
    id: "beginner-strength",
    label: "Beginner",
    title: "Beginner Strength",
    description: "Simple full-body strength to build a steady base.",
    durationSec: null,
    kind: "countup",
    lane: "foundation",
  },

  // ---- Challenge (higher-effort) ----
  run: {
    id: "run",
    label: "Run",
    title: "Easy Run",
    description: "Run at an easy pace and thank God for your strength.",
    durationSec: 20 * 60,
    kind: "countdown",
    lane: "challenge",
  },
  "full-body": {
    id: "full-body",
    label: "Full Body",
    title: "Full Body Strength",
    description: "Train the whole body with intention — your body is His temple.",
    durationSec: null,
    kind: "countup",
    lane: "challenge",
  },
  gym: {
    id: "gym",
    label: "Gym",
    title: "Gym Session",
    description: "A focused gym session, offered as worship.",
    durationSec: null,
    kind: "countup",
    lane: "challenge",
  },
  conditioning: {
    id: "conditioning",
    label: "Conditioning",
    title: "Conditioning Workout",
    description: "Higher-effort conditioning to build endurance and discipline.",
    durationSec: 20 * 60,
    kind: "countdown",
    lane: "challenge",
  },
};

// Activities shown in each Move lane.
export const foundationActivities = ["walk", "mobility", "stretch", "beginner-strength"];
export const challengeActivities = ["run", "full-body", "gym", "conditioning"];

export function activitiesForLane(mode: UserMode): string[] {
  return mode === "athlete" ? challengeActivities : foundationActivities;
}

// A small representative set used by the onboarding "how do you move most?" step.
export const activityOrder = ["walk", "run", "full-body", "stretch"];

export function defaultActivityId(mode: UserMode): string {
  return mode === "athlete" ? "run" : "walk";
}
