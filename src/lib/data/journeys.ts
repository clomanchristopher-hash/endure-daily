import { MovementJourney } from "@/types";

// Original Endure Daily movement content. Written in our own voice — outside
// programs are used only as loose structural inspiration for phase-based
// training. No copyrighted text, branding, athlete/supplement names, or exact
// third-party workout descriptions.
//
// Free previews ship full 1-week schedules. Premium journeys are visible as
// intentional future-release previews (not purchasable yet); their full guided
// content arrives in a future release.
// TODO(premium): gate access with real entitlement once IAP/subscriptions ship
// (RevenueCat / Apple In-App Purchase on iOS, Stripe on web).

const runningJourneys: MovementJourney[] = [
  {
    id: "first-5k-preview",
    category: "running",
    title: "First 5K Preview",
    description:
      "Build confidence through simple run/walk intervals and steady consistency.",
    level: "foundation",
    access: "free",
    duration_weeks: 1,
    distance: "5K",
    days: [
      {
        day: 1,
        title: "Run/Walk Intervals",
        purpose: "Build confidence one interval at a time.",
        workout_text: "Run 1 minute, walk 2 minutes. Repeat 8 times.",
        faith_focus: "One faithful step counts.",
        timer_kind: "countdown",
        timer_seconds: 24 * 60,
      },
      {
        day: 2,
        title: "Rest or Easy Walk",
        purpose: "Recover while staying intentional.",
        workout_text: "Rest or take a 15–20 minute easy walk.",
        faith_focus: "Growth also happens in recovery.",
        timer_kind: "countup",
        timer_seconds: null,
      },
      {
        day: 3,
        title: "Run/Walk Intervals",
        purpose: "Practice consistency.",
        workout_text: "Run 1 minute, walk 2 minutes. Repeat 9 times.",
        faith_focus: "Discipline is built by showing up again.",
        timer_kind: "countdown",
        timer_seconds: 27 * 60,
      },
      {
        day: 4,
        title: "Recovery + Mobility",
        purpose: "Take care of the body God gave you.",
        workout_text: "Stretch or move gently for 10–15 minutes.",
        faith_focus: "Stewardship includes recovery.",
        timer_kind: "countup",
        timer_seconds: null,
      },
      {
        day: 5,
        title: "Longer Walk/Run",
        purpose: "Build endurance patiently.",
        workout_text: "Run 1 minute, walk 2 minutes. Repeat 10 times.",
        faith_focus: "Run with patience today.",
        timer_kind: "countdown",
        timer_seconds: 30 * 60,
      },
      {
        day: 6,
        title: "Optional Walk",
        purpose: "Move with gratitude.",
        workout_text: "Walk 20 minutes at an easy pace.",
        faith_focus: "Use this time to pray and reflect.",
        timer_kind: "countdown",
        timer_seconds: 20 * 60,
      },
      {
        day: 7,
        title: "Rest",
        purpose: "Reset for the week ahead.",
        workout_text: "Rest.",
        faith_focus: "Rest is part of the rhythm.",
        is_rest: true,
        timer_kind: "countup",
        timer_seconds: null,
      },
    ],
  },
  {
    id: "first-5k-full",
    category: "running",
    title: "First 5K Full Journey",
    description: "A guided 6-week journey to your first 5K, building endurance with patience and faith.",
    level: "foundation",
    access: "premium",
    duration_weeks: 6,
    distance: "5K",
    days: [],
  },
  {
    id: "first-10k",
    category: "running",
    title: "First 10K Journey",
    description: "Grow from 5K to 10K over 8 weeks of steady, faithful training.",
    level: "foundation",
    access: "premium",
    duration_weeks: 8,
    distance: "10K",
    days: [],
  },
  {
    id: "half-marathon",
    category: "running",
    title: "Half Marathon Journey",
    description: "Train for 13.1 miles with a disciplined 12-week endurance build.",
    level: "challenge",
    access: "premium",
    duration_weeks: 12,
    distance: "Half Marathon",
    days: [],
  },
  {
    id: "marathon",
    category: "running",
    title: "Marathon Journey",
    description: "A 16-week journey to the marathon, one faithful mile at a time.",
    level: "challenge",
    access: "premium",
    duration_weeks: 16,
    distance: "Marathon",
    days: [],
  },
  {
    id: "50k-endurance",
    category: "running",
    title: "50K Endurance Journey",
    description: "Go beyond the marathon with a 20-week ultra-endurance journey.",
    level: "challenge",
    access: "premium",
    duration_weeks: 20,
    distance: "50K",
    days: [],
  },
];

const strengthJourneys: MovementJourney[] = [
  {
    id: "foundation-strength-preview",
    category: "strength",
    title: "Foundation Strength Preview",
    description: "Build consistency with simple full-body strength sessions.",
    level: "foundation",
    access: "free",
    duration_weeks: 1,
    days: [
      {
        day: 1,
        title: "Upper Body Foundation",
        purpose: "Build control and consistency.",
        exercises: [
          { name: "Incline Push-Up", scheme: "3 sets of 8–10" },
          { name: "Dumbbell Row", scheme: "3 sets of 10" },
          { name: "Shoulder Press", scheme: "3 sets of 8–10" },
          { name: "Plank", scheme: "3 rounds of 30 seconds" },
        ],
        faith_focus: "Discipline starts with showing up.",
        timer_kind: "countup",
        timer_seconds: null,
      },
      {
        day: 2,
        title: "Rest or Walk",
        purpose: "Recover with intention.",
        workout_text: "Rest or walk 15–20 minutes.",
        faith_focus: "Small steps still matter.",
        timer_kind: "countup",
        timer_seconds: null,
      },
      {
        day: 3,
        title: "Lower Body Foundation",
        purpose: "Build a strong base.",
        exercises: [
          { name: "Bodyweight Squat", scheme: "3 sets of 10–12" },
          { name: "Glute Bridge", scheme: "3 sets of 12" },
          { name: "Reverse Lunge", scheme: "3 sets of 8 each leg" },
          { name: "Dead Bug", scheme: "3 rounds of 8 each side" },
        ],
        faith_focus: "Strength grows through consistency.",
        timer_kind: "countup",
        timer_seconds: null,
      },
      {
        day: 4,
        title: "Recovery + Mobility",
        purpose: "Move well and recover well.",
        workout_text: "Stretch or move gently for 10–15 minutes.",
        faith_focus: "Recovery is stewardship.",
        timer_kind: "countup",
        timer_seconds: null,
      },
      {
        day: 5,
        title: "Full Body Foundation",
        purpose: "Move with purpose from head to toe.",
        exercises: [
          { name: "Goblet Squat", scheme: "3 sets of 10" },
          { name: "Dumbbell Press", scheme: "3 sets of 8–10" },
          { name: "Dumbbell Row", scheme: "3 sets of 10" },
          { name: "Farmer Carry", scheme: "3 rounds of 30 seconds" },
        ],
        faith_focus: "Faithfulness grows through consistency.",
        timer_kind: "countup",
        timer_seconds: null,
      },
      {
        day: 6,
        title: "Optional Walk",
        purpose: "Stay active without pressure.",
        workout_text: "Walk 20 minutes at an easy pace.",
        faith_focus: "One faithful step counts.",
        timer_kind: "countdown",
        timer_seconds: 20 * 60,
      },
      {
        day: 7,
        title: "Rest",
        purpose: "Reset and prepare.",
        workout_text: "Rest.",
        faith_focus: "Rest is part of discipline.",
        is_rest: true,
        timer_kind: "countup",
        timer_seconds: null,
      },
    ],
  },
  {
    id: "foundation-strength-full",
    category: "strength",
    title: "Foundation Strength Full Journey",
    description: "A 4-week guided journey to a strong, consistent foundation.",
    level: "foundation",
    access: "premium",
    duration_weeks: 4,
    days: [],
  },
  {
    id: "challenge-strength",
    category: "strength",
    title: "Challenge Strength Journey",
    description: "Push your progress with 4 weeks of higher-effort, full-body strength.",
    level: "challenge",
    access: "premium",
    duration_weeks: 4,
    days: [],
  },
  {
    id: "strength-conditioning",
    category: "strength",
    title: "Strength + Conditioning Journey",
    description: "Blend strength and conditioning over 6 disciplined weeks.",
    level: "challenge",
    access: "premium",
    duration_weeks: 6,
    days: [],
  },
  {
    id: "recovery-mobility",
    category: "strength",
    title: "Recovery + Mobility Journey",
    description: "Two gentle weeks of mobility and recovery to move well and stay faithful.",
    level: "foundation",
    access: "premium",
    duration_weeks: 2,
    days: [],
  },
];

export const journeys: MovementJourney[] = [...runningJourneys, ...strengthJourneys];

export function getJourneyById(id: string): MovementJourney | undefined {
  return journeys.find((j) => j.id === id);
}

export function getJourneysByCategory(category: MovementJourney["category"]): MovementJourney[] {
  return journeys.filter((j) => j.category === category);
}

// Polished future-release copy for locked premium plans. No pricing/purchase
// here — these are shown as intentional previews of what's being prepared.
export function premiumMessage(category: MovementJourney["category"]): {
  eyebrow: string;
  title: string;
  body: string;
} {
  const eyebrow = "Premium Journey Preview";
  const title = "Premium Journeys will be available in a future release.";
  if (category === "running") {
    return {
      eyebrow,
      title,
      body: "Full guided running journeys — with training, recovery, and faith-centered discipline — are being prepared for a future release.",
    };
  }
  return {
    eyebrow,
    title,
    body: "Full guided strength journeys — with guided workouts, recovery, and faith-centered discipline — are being prepared for a future release.",
  };
}
