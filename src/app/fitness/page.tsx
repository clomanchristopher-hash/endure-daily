"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Dumbbell, Footprints, Sparkles } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { readJSON, todayKey, writeJSON } from "@/lib/storage";
import {
  ACTIVITY_STORAGE_KEY,
  activities,
  activityOrder,
  defaultActivityId,
} from "@/lib/data/activities";
import { getJourneyById } from "@/lib/data/journeys";
import { MovementJourney, JourneyProgress } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { AssignmentTimer } from "@/components/move/AssignmentTimer";
import { WorkoutDetails } from "@/components/journeys/WorkoutDetails";

const ACTIVITY_KEY = ACTIVITY_STORAGE_KEY;
const COMPLETE_KEY = "assignment-complete-date";

export default function MovePage() {
  const { profile, journeyProgress, completeJourneyDay } = useAppState();
  const [showQuickActivity, setShowQuickActivity] = useState(false);

  const journey = journeyProgress.plan_id
    ? getJourneyById(journeyProgress.plan_id)
    : undefined;
  // Only free previews carry a startable schedule.
  const journeyActive = Boolean(journey && journey.days.length > 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Move</h1>
          <p className="mt-1 text-sm text-muted">One assignment. Move with purpose.</p>
        </div>
        <ModeToggle />
      </div>

      {journeyActive && journey && !showQuickActivity ? (
        <JourneyAssignment
          journey={journey}
          progress={journeyProgress}
          onComplete={completeJourneyDay}
          onQuickActivity={() => setShowQuickActivity(true)}
        />
      ) : (
        <ActivityAssignment
          profileMode={profile.mode}
          showBackToJourney={journeyActive}
          onBackToJourney={() => setShowQuickActivity(false)}
        />
      )}
    </div>
  );
}

// ---- Movement Journey assignment (running or strength) --------------------

function JourneyAssignment({
  journey,
  progress,
  onComplete,
  onQuickActivity,
}: {
  journey: MovementJourney;
  progress: JourneyProgress;
  onComplete: () => void;
  onQuickActivity: () => void;
}) {
  const { leaveJourney } = useAppState();
  const finished = progress.current_week > journey.duration_weeks;
  const doneToday = progress.last_completed_date === todayKey();
  const day = journey.days[progress.current_day - 1];
  const CategoryIcon = journey.category === "running" ? Footprints : Dumbbell;

  const manageLinks = (
    <div className="mt-4 flex flex-col items-center gap-1 text-xs text-muted">
      <button onClick={onQuickActivity} className="font-semibold text-gold-soft hover:text-gold">
        Prefer a quick activity today?
      </button>
      <button onClick={leaveJourney} className="hover:text-foreground">
        Leave this Journey
      </button>
    </div>
  );

  if (finished) {
    return (
      <Card className="mt-5 border-evergreen/30 bg-evergreen/5 text-center">
        <CheckCircle2 size={28} className="mx-auto text-evergreen" />
        <h2 className="mt-3 font-serif text-2xl font-bold text-foreground">Journey Complete</h2>
        <p className="mt-1 text-muted">
          You finished {journey.title}. Well done staying faithful to the work.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link href="/plans" className="flex-1">
            <Button className="w-full">Explore More Journeys</Button>
          </Link>
          <Button variant="outline" className="flex-1" onClick={leaveJourney}>
            Leave Plan
          </Button>
        </div>
      </Card>
    );
  }

  if (doneToday) {
    return (
      <>
        <Card className="mt-5 border-evergreen/30 bg-evergreen/5">
          <Badge tone="evergreen">
            <CheckCircle2 size={12} /> Today&apos;s Assignment Complete
          </Badge>
          <h2 className="mt-3 font-serif text-2xl font-bold text-foreground">Well done.</h2>
          <p className="mt-1 text-muted">
            You showed up and put in the work. Rest, recover, and come back tomorrow.
          </p>
          <div className="mt-4 rounded-xl border border-border-subtle bg-surface-raised p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Next up · Week {progress.current_week} · Day {progress.current_day}
            </p>
            <p className="mt-1 font-serif text-lg font-semibold text-foreground">{day.title}</p>
          </div>
        </Card>
        {manageLinks}
      </>
    );
  }

  return (
    <>
      <Card className="mt-5 border-gold/30 bg-gold/5">
        <div className="flex items-center justify-between">
          <Badge tone="gold">
            <Sparkles size={12} /> Move with Purpose
          </Badge>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Today&apos;s Assignment
          </span>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-soft">
          <CategoryIcon size={13} /> {journey.title} · Week {progress.current_week} · Day{" "}
          {progress.current_day}
        </p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">{day.title}</h2>
        <p className="mt-1 text-muted">{day.purpose}</p>

        <div className="mt-4 rounded-xl border border-border-subtle bg-surface-raised p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Workout</p>
          <WorkoutDetails day={day} />
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-lg bg-gold/10 p-3 text-sm text-foreground">
          <Sparkles size={15} className="mt-0.5 shrink-0 text-gold-soft" />
          <span>
            <span className="font-semibold text-gold-soft">Faith Focus: </span>
            {day.faith_focus}
          </span>
        </div>

        {day.is_rest ? (
          <Button className="mt-5 w-full" onClick={onComplete}>
            <CheckCircle2 size={16} /> Mark Complete
          </Button>
        ) : (
          <AssignmentTimer
            key={`${progress.current_week}-${progress.current_day}`}
            kind={day.timer_kind}
            durationSec={day.timer_seconds}
            onFinish={onComplete}
          />
        )}
      </Card>

      {manageLinks}
    </>
  );
}

// ---- Regular activity assignment (walk / run / gym / recovery) ------------

function ActivityAssignment({
  profileMode,
  showBackToJourney,
  onBackToJourney,
}: {
  profileMode: "leisure" | "athlete";
  showBackToJourney: boolean;
  onBackToJourney: () => void;
}) {
  const { dailyProgress, toggleDailyProgress } = useAppState();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const savedId = readJSON<string | null>(ACTIVITY_KEY, null);
    if (savedId && activities[savedId]) setSelectedId(savedId);
    setCompleted(readJSON<string | null>(COMPLETE_KEY, null) === todayKey());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const activity = activities[selectedId ?? defaultActivityId(profileMode)];

  function selectActivity(id: string) {
    setSelectedId(id);
    writeJSON(ACTIVITY_KEY, id);
  }

  function handleFinish() {
    writeJSON(COMPLETE_KEY, todayKey());
    setCompleted(true);
    if (!dailyProgress.workout) toggleDailyProgress("workout");
  }

  return (
    <>
      {showBackToJourney && (
        <button
          onClick={onBackToJourney}
          className="mt-4 flex items-center gap-1 text-sm font-semibold text-gold-soft hover:text-gold"
        >
          <ArrowLeft size={15} /> Back to your Journey
        </button>
      )}

      <Card className="mt-5 border-gold/30 bg-gold/5">
        <div className="flex items-center justify-between">
          <Badge tone="gold">
            <Sparkles size={12} /> Move with Purpose
          </Badge>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Today&apos;s Assignment
          </span>
        </div>

        <h2 className="mt-3 font-serif text-2xl font-bold text-foreground">{activity.title}</h2>
        <p className="mt-1 text-muted">{activity.description}</p>

        {completed && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-evergreen/40 bg-evergreen/10 px-3 py-2.5 text-sm font-medium text-evergreen">
            <CheckCircle2 size={16} className="shrink-0" />
            You completed today&apos;s assignment.
          </div>
        )}

        <AssignmentTimer
          key={activity.id}
          kind={activity.kind}
          durationSec={activity.durationSec}
          onFinish={handleFinish}
        />
      </Card>

      <h3 className="mt-8 text-xs font-semibold uppercase tracking-wider text-muted">
        More Activities
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {activityOrder.map((id) => {
          const a = activities[id];
          const active = a.id === activity.id;
          return (
            <button
              key={id}
              onClick={() => selectActivity(id)}
              aria-pressed={active}
              className={`rounded-xl border px-3 py-3 text-center text-sm font-semibold transition-colors ${
                active
                  ? "border-transparent bg-gold text-[#0d1510]"
                  : "border-border-subtle bg-surface text-muted hover:text-foreground"
              }`}
            >
              {a.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-muted">One faithful step counts.</p>
    </>
  );
}
