"use client";

import { useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { plans } from "@/lib/data/plans";
import { getJourneysByCategory } from "@/lib/data/journeys";
import { JourneyCategory } from "@/types";
import { PlanCard } from "@/components/plans/PlanCard";
import { JourneyCard } from "@/components/journeys/JourneyCard";
import { PremiumLockModal } from "@/components/journeys/PremiumLockModal";

export default function PlansPage() {
  const { profile, journeyProgress } = useAppState();
  const [lockedCategory, setLockedCategory] = useState<JourneyCategory | null>(null);

  const runningJourneys = getJourneysByCategory("running");
  const strengthJourneys = getJourneysByCategory("strength");

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
      <h1 className="font-serif text-2xl font-bold text-foreground">Plans</h1>
      <p className="mt-1 text-sm text-muted">
        Multi-day devotion journeys to build momentum in your faith and fitness.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            progress={profile.plan_progress[plan.id] ?? 0}
            active={profile.active_plan_id === plan.id}
          />
        ))}
      </div>

      {/* Movement Journeys */}
      <div className="mt-10">
        <h2 className="font-serif text-xl font-bold text-foreground">Movement Journeys</h2>
        <p className="mt-1 text-sm text-muted">
          Train with purpose, one faithful step at a time.
        </p>

        <JourneyGroup
          title="Running Journeys"
          subtitle="Build endurance one faithful step at a time."
          journeys={runningJourneys}
          activeId={journeyProgress.plan_id}
          onLocked={setLockedCategory}
        />

        <JourneyGroup
          title="Strength Journeys"
          subtitle="Build strength with purpose, one day at a time."
          journeys={strengthJourneys}
          activeId={journeyProgress.plan_id}
          onLocked={setLockedCategory}
        />
      </div>

      <PremiumLockModal category={lockedCategory} onClose={() => setLockedCategory(null)} />
    </div>
  );
}

function JourneyGroup({
  title,
  subtitle,
  journeys,
  activeId,
  onLocked,
}: {
  title: string;
  subtitle: string;
  journeys: ReturnType<typeof getJourneysByCategory>;
  activeId: string | null;
  onLocked: (category: JourneyCategory) => void;
}) {
  return (
    <div className="mt-7">
      <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {journeys.map((journey) => (
          <JourneyCard
            key={journey.id}
            journey={journey}
            active={activeId === journey.id}
            onLockedClick={() => onLocked(journey.category)}
          />
        ))}
      </div>
    </div>
  );
}
