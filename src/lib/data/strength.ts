import { StrengthPlan } from "@/types";

// Original Endure Daily strength content. Written in our own voice — phase-based
// structure only, no copyrighted program text, exercise descriptions, or names
// from any external guide.
export const strengthPlans: StrengthPlan[] = [
  {
    id: "foundation-strength",
    title: "Foundation Strength",
    description:
      "A beginner-friendly strength journey focused on consistency, form, and building a strong base.",
    lane: "foundation",
    days_per_week: 3,
    duration_weeks: 4,
    workouts: [
      {
        day: 1,
        title: "Upper Body Foundation",
        purpose: "Build consistency and control.",
        exercises: [
          { name: "Incline Push-Up", scheme: "3 sets of 8–10" },
          { name: "Dumbbell Row", scheme: "3 sets of 10" },
          { name: "Shoulder Press", scheme: "3 sets of 8–10" },
          { name: "Plank", scheme: "3 rounds of 30 seconds" },
        ],
        faith_focus: "Discipline starts with showing up.",
      },
      {
        day: 2,
        title: "Lower Body Foundation",
        purpose: "Move with steady, controlled effort.",
        exercises: [
          { name: "Bodyweight Squat", scheme: "3 sets of 10–12" },
          { name: "Romanian Deadlift", scheme: "3 sets of 8–10" },
          { name: "Reverse Lunge", scheme: "3 sets of 8 per side" },
          { name: "Plank", scheme: "3 rounds of 30 seconds" },
        ],
        faith_focus: "A strong base is built one honest rep at a time.",
      },
      {
        day: 3,
        title: "Full Body Foundation",
        purpose: "Tie it together and finish the week faithful.",
        exercises: [
          { name: "Incline Push-Up", scheme: "3 sets of 8–10" },
          { name: "Dumbbell Row", scheme: "3 sets of 10" },
          { name: "Goblet Squat", scheme: "3 sets of 10" },
          { name: "Farmer Carry", scheme: "3 rounds of 30 seconds" },
        ],
        faith_focus: "Faithful in the small things, strengthened for the next.",
      },
    ],
  },
  {
    id: "challenge-strength",
    title: "Challenge Strength",
    description:
      "A higher-effort strength journey focused on progression, discipline, and full-body strength.",
    lane: "challenge",
    days_per_week: 4,
    duration_weeks: 4,
    workouts: [
      {
        day: 1,
        title: "Chest + Back",
        purpose: "Train with focus and effort.",
        exercises: [
          { name: "Dumbbell Bench Press", scheme: "4 sets of 8–12" },
          { name: "Pull-Ups or Lat Pulldown", scheme: "4 sets of 8–12" },
          { name: "Incline Dumbbell Press", scheme: "3 sets of 10" },
          { name: "Seated Row", scheme: "3 sets of 10–12" },
          { name: "Push-Up Finisher", scheme: "2 rounds to controlled effort" },
        ],
        faith_focus: "Strength is built through steady discipline.",
      },
      {
        day: 2,
        title: "Legs + Core",
        purpose: "Drive through your legs with intention.",
        exercises: [
          { name: "Goblet Squat", scheme: "4 sets of 8–12" },
          { name: "Romanian Deadlift", scheme: "4 sets of 8–10" },
          { name: "Walking Lunge", scheme: "3 sets of 10 per side" },
          { name: "Hanging or Lying Leg Raise", scheme: "3 sets of 12" },
          { name: "Plank", scheme: "3 rounds of 45 seconds" },
        ],
        faith_focus: "Endurance is forged in the reps no one sees.",
      },
      {
        day: 3,
        title: "Shoulders + Arms",
        purpose: "Sharpen control with cleaner reps.",
        exercises: [
          { name: "Shoulder Press", scheme: "4 sets of 8–12" },
          { name: "Lateral Raise", scheme: "3 sets of 12–15" },
          { name: "Dumbbell Curl", scheme: "3 sets of 10–12" },
          { name: "Overhead Triceps Extension", scheme: "3 sets of 10–12" },
          { name: "Plank Shoulder Tap", scheme: "2 rounds of 20 taps" },
        ],
        faith_focus: "Consistency turns effort into strength.",
      },
      {
        day: 4,
        title: "Full Body Conditioning",
        purpose: "Finish the week strong and steady.",
        exercises: [
          { name: "Goblet Squat", scheme: "3 sets of 12" },
          { name: "Dumbbell Row", scheme: "3 sets of 12" },
          { name: "Push-Up", scheme: "3 sets to controlled effort" },
          { name: "Farmer Carry", scheme: "3 rounds of 40 seconds" },
          { name: "Plank", scheme: "3 rounds of 45 seconds" },
        ],
        faith_focus: "Press on — one faithful workout at a time.",
      },
    ],
  },
];

export function getStrengthPlanById(id: string): StrengthPlan | undefined {
  return strengthPlans.find((p) => p.id === id);
}
