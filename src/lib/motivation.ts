import { UserMode } from "@/types";

const motivationByTheme: Record<string, Record<UserMode, string>> = {
  Strength: {
    leisure: "You don't need to be strong to start — you need to start to become strong. Move today.",
    athlete: "Weakness is where grace shows up loudest. Chase the rep that scares you.",
  },
  Endurance: {
    leisure: "Slow and steady still finishes the race. Just keep moving.",
    athlete: "Pace yourself for the long race, not just today's mile.",
  },
  Renewal: {
    leisure: "Tired isn't the end — it's the invitation to wait on God and rise again.",
    athlete: "Recovery is training too. Trust the process that renews you.",
  },
  Discipline: {
    leisure: "Discipline beats motivation every time. Show up anyway.",
    athlete: "Champions train on the days no one's watching. Be a good soldier today.",
  },
  Stewardship: {
    leisure: "Care for your body today like it matters — because it does.",
    athlete: "Train hard, fuel well, rest right — stewardship is a full workout.",
  },
  Courage: {
    leisure: "Fear is loud, but you don't have to listen. Take the first step.",
    athlete: "The giant in front of you is smaller than the God behind you. Go after it.",
  },
  Purpose: {
    leisure: "Forget yesterday's excuses. Today is a fresh start.",
    athlete: "Play for an audience of One. Press toward the goal.",
  },
  Rest: {
    leisure: "Rest isn't quitting — it's part of the plan. Breathe today.",
    athlete: "Recovery days build the gains your ego wants to skip.",
  },
  Perseverance: {
    leisure: "One small step today still counts as moving forward.",
    athlete: "Strength for today isn't about the good days only — show up anyway.",
  },
  Community: {
    leisure: "You go further with someone beside you. Reach out today.",
    athlete: "Iron sharpens iron — push your training partner and let them push you.",
  },
  Consistency: {
    leisure: "The harvest comes in due season. Don't quit today.",
    athlete: "Plateaus break from consistency, not intensity alone. Keep stacking days.",
  },
  Victory: {
    leisure: "Victory today just means you showed up. That's a win.",
    athlete: "Fight the good fight. Finish today's work well.",
  },
};

export function getWorkoutMotivation(theme: string, mode: UserMode): string {
  return (
    motivationByTheme[theme]?.[mode] ??
    (mode === "athlete"
      ? "Compete like it matters, because your effort is an offering."
      : "Every small step today is progress worth celebrating.")
  );
}
