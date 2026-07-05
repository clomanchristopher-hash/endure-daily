"use client";

import { useState } from "react";
import { getJourneysByCategory } from "@/lib/data/journeys";
import { JourneyCategory } from "@/types";
import { JourneyCard } from "@/components/journeys/JourneyCard";
import { PremiumLockModal } from "@/components/journeys/PremiumLockModal";

// The full Movement Journeys list (Running + Strength). Self-contained: owns
// the premium lock modal. Rendered inside the Move tab's Journeys view.
export function MovementJourneys({ activeId }: { activeId: string | null }) {
  const [lockedCategory, setLockedCategory] = useState<JourneyCategory | null>(null);
  const runningJourneys = getJourneysByCategory("running");
  const strengthJourneys = getJourneysByCategory("strength");

  return (
    <div>
      <h2 className="font-serif text-xl font-bold text-foreground">Movement Journeys</h2>
      <p className="mt-1 text-sm text-muted">
        Train with purpose, one faithful step at a time.
      </p>

      <JourneyGroup
        title="Running Journeys"
        subtitle="Build endurance one faithful step at a time."
        journeys={runningJourneys}
        activeId={activeId}
        onLocked={setLockedCategory}
      />

      <JourneyGroup
        title="Strength Journeys"
        subtitle="Build strength with purpose, one day at a time."
        journeys={strengthJourneys}
        activeId={activeId}
        onLocked={setLockedCategory}
      />

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
