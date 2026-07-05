"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Dumbbell,
  Footprints,
  Lock,
  ShieldAlert,
} from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { getJourneyById, premiumMessage } from "@/lib/data/journeys";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WorkoutDetails } from "@/components/journeys/WorkoutDetails";

export function JourneyDetail({ id }: { id: string }) {
  const router = useRouter();
  const { journeyProgress, startJourney, leaveJourney } = useAppState();
  const journey = getJourneyById(id);

  if (!journey) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-muted">This journey could not be found.</p>
        <Link href="/plans" className="mt-3 inline-block text-gold-soft">
          Back to Plans
        </Link>
      </div>
    );
  }

  const isFree = journey.access === "free";
  const isActive = journeyProgress.plan_id === journey.id;
  const CategoryIcon = journey.category === "running" ? Footprints : Dumbbell;
  const categoryLabel = journey.category === "running" ? "Running" : "Strength";
  const levelLabel = journey.level === "challenge" ? "Challenge" : "Foundation";
  const durationLabel = `${journey.duration_weeks} ${
    journey.duration_weeks === 1 ? "Week" : "Weeks"
  }`;

  function handleStart() {
    // Part 11 — confirm before replacing an existing active journey.
    if (journeyProgress.plan_id && journeyProgress.plan_id !== journey!.id) {
      const ok = window.confirm(
        "You already have an active Movement Journey. Replace it with this one?"
      );
      if (!ok) return;
    }
    startJourney(journey!.id);
    router.push("/fitness");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <Link
        href="/plans"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to Plans
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <Badge tone={isFree ? "evergreen" : "muted"}>
          {isFree ? "Free Preview" : "Premium"}
        </Badge>
        {isActive && <Badge tone="gold">Active</Badge>}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <CategoryIcon size={22} className="text-gold-soft" />
        <h1 className="font-serif text-2xl font-bold text-foreground">{journey.title}</h1>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
        <span>{categoryLabel}</span>
        <span>·</span>
        <span className="inline-flex items-center gap-1">
          <CalendarDays size={14} /> {durationLabel}
        </span>
        <span>·</span>
        <span>{levelLabel}</span>
        {journey.distance && (
          <>
            <span>·</span>
            <span>{journey.distance}</span>
          </>
        )}
      </div>

      <p className="mt-3 leading-relaxed text-foreground/90">{journey.description}</p>

      {isFree ? (
        <>
          {/* Start / manage */}
          <div className="mt-5 flex gap-3">
            {isActive ? (
              <>
                <Link href="/fitness" className="flex-1">
                  <Button className="w-full">
                    <Check size={16} /> Go to Today&apos;s Assignment
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1" onClick={leaveJourney}>
                  Leave Plan
                </Button>
              </>
            ) : (
              <Button className="flex-1" onClick={handleStart}>
                Start Plan
              </Button>
            )}
          </div>

          {/* Weekly schedule */}
          <h2 className="mt-8 font-serif text-lg font-semibold text-foreground">Weekly Schedule</h2>
          <div className="mt-3 flex flex-col gap-3">
            {journey.days.map((d) => (
              <Card key={d.day} className={d.is_rest ? "opacity-90" : ""}>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Day {d.day}
                </p>
                <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">
                  {d.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{d.purpose}</p>
                <WorkoutDetails day={d} />
                <p className="mt-3 text-sm text-gold-soft">
                  <span className="font-semibold">Faith Focus: </span>
                  {d.faith_focus}
                </p>
              </Card>
            ))}
          </div>
        </>
      ) : (
        // Locked premium — Coming Soon state (no schedule / start).
        <LockedState category={journey.category} />
      )}

      {/* Safety note */}
      <div className="mt-6 flex items-start gap-2 rounded-lg border border-border-subtle bg-surface p-4 text-xs text-muted">
        <ShieldAlert size={16} className="mt-0.5 shrink-0 text-muted" />
        <p>
          Move at your own pace. Modify exercises as needed and consult a qualified professional
          before beginning a new training program.
        </p>
      </div>
    </div>
  );
}

function LockedState({ category }: { category: "running" | "strength" }) {
  const msg = premiumMessage(category);
  return (
    <Card className="mt-6 text-center">
      <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold-soft">
        <Lock size={22} />
      </span>
      <h2 className="font-serif text-lg font-bold text-foreground">{msg.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{msg.body}</p>
      <Link href="/plans" className="mt-4 inline-block">
        <Button variant="outline">Got it</Button>
      </Link>
    </Card>
  );
}
