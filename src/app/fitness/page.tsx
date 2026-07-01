"use client";

import { useMemo } from "react";
import { Dumbbell, Flame } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { getDevotionForDate } from "@/lib/data/devotions";
import { getWorkoutMotivation } from "@/lib/motivation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ModeToggle } from "@/components/ui/ModeToggle";

const modeCopy = {
  leisure: {
    heading: "Leisure Mode",
    description:
      "For anyone walking, stretching, getting back active, or building a simple, sustainable movement habit. No comparison — just consistency.",
  },
  athlete: {
    heading: "Athlete Mode",
    description:
      "For runners, lifters, football and basketball players, and anyone training competitively. Faith fuels the intensity.",
  },
};

export default function FitnessPage() {
  const { profile, devotions } = useAppState();
  const copy = modeCopy[profile.mode];

  const today = useMemo(() => getDevotionForDate(new Date(), devotions), [devotions]);
  const todayMotivation = getWorkoutMotivation(today.theme, profile.mode);
  const todayChallenge =
    profile.mode === "athlete" ? today.athlete_challenge : today.leisure_challenge;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Fitness Motivation</h1>
          <p className="mt-1 text-sm text-muted">{copy.description}</p>
        </div>
        <ModeToggle />
      </div>

      <Card className="mt-5 border-gold/30 bg-gold/5">
        <Badge tone="gold">Today&apos;s Focus — {today.theme}</Badge>
        <p className="mt-2 font-serif text-lg text-foreground">{todayMotivation}</p>
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-surface-raised p-3 text-sm text-foreground">
          <Flame size={16} className="mt-0.5 shrink-0 text-ember" />
          {todayChallenge}
        </div>
      </Card>

      <h2 className="mt-8 font-serif text-lg font-semibold text-foreground">
        Every Challenge — {copy.heading}
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {devotions.map((d) => (
          <Card key={d.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Badge tone="muted">{d.theme}</Badge>
              <Dumbbell size={15} className="text-muted" />
            </div>
            <p className="font-serif text-sm font-semibold text-foreground">{d.title}</p>
            <p className="text-sm text-muted">
              {profile.mode === "athlete" ? d.athlete_challenge : d.leisure_challenge}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
