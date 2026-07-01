import { Plan } from "@/types";
import { devotions } from "./devotions";

const ids = devotions.map((d) => d.id);
// Small helper so plan lists stay readable below even though we only have
// 12 seed devotions today — cycles through them to fill longer plans.
function cycle(count: number, offset = 0): string[] {
  return Array.from({ length: count }, (_, i) => ids[(i + offset) % ids.length]);
}

export const plans: Plan[] = [
  {
    id: "get-back-up-7-day",
    title: "7-Day Get Back Up Challenge",
    subtitle: "For anyone starting over",
    description:
      "A one-week reset for anyone who has fallen off track — spiritually, physically, or both. Short, encouraging devotions paired with beginner-friendly movement to help you take the first step back.",
    duration_days: 7,
    category: "both",
    devotion_ids: cycle(7),
    premium: false,
  },
  {
    id: "discipline-30-day",
    title: "30-Day Discipline Challenge",
    subtitle: "Build the habit that outlasts motivation",
    description:
      "A month-long journey through Scripture and movement designed to build durable discipline in your walk with God and your body. Motivation fades — this plan trains what replaces it.",
    duration_days: 30,
    category: "both",
    devotion_ids: cycle(30),
    premium: false,
  },
  {
    id: "athlete-game-day",
    title: "Athlete Game Day Devotions",
    subtitle: "Pre-competition focus and faith",
    description:
      "Built for competitive athletes — football, basketball, and beyond. Short, intense devotions to center your mind and spirit before you take the field or court.",
    duration_days: 7,
    category: "athlete",
    devotion_ids: cycle(7, 3),
    premium: false,
  },
  {
    id: "runners-endurance",
    title: "Runner's Endurance Devotions",
    subtitle: "Faith for the long miles",
    description:
      "A devotion series for runners chasing endurance, built around Scripture's own language of racing, patience, and finishing well.",
    duration_days: 14,
    category: "athlete",
    devotion_ids: cycle(14, 1),
    premium: false,
  },
  {
    id: "beginner-fitness",
    title: "Beginner Fitness Devotions",
    subtitle: "Gentle, encouraging first steps",
    description:
      "For those just getting started with movement. No pressure, no comparison — just steady encouragement to build a sustainable habit one day at a time.",
    duration_days: 10,
    category: "leisure",
    devotion_ids: cycle(10, 2),
    premium: false,
  },
];

export function getPlanById(id: string): Plan | undefined {
  return plans.find((p) => p.id === id);
}
