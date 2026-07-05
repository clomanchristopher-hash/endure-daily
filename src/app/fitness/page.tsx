"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Dumbbell, Sparkles } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { readJSON, todayKey, writeJSON } from "@/lib/storage";
import {
  ACTIVITY_STORAGE_KEY,
  activities,
  activityOrder,
  defaultActivityId,
} from "@/lib/data/activities";
import { getStrengthPlanById } from "@/lib/data/strength";
import { StrengthPlan, StrengthProgress } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { AssignmentTimer } from "@/components/move/AssignmentTimer";

const ACTIVITY_KEY = ACTIVITY_STORAGE_KEY;
const COMPLETE_KEY = "assignment-complete-date";

export default function MovePage() {
  const { profile, strengthProgress, completeStrengthWorkout } = useAppState();
  const [showQuickActivity, setShowQuickActivity] = useState(false);

  const strengthPlan = strengthProgress.plan_id
    ? getStrengthPlanById(strengthProgress.plan_id)
    : undefined;
  const strengthActive = Boolean(strengthPlan);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Move</h1>
          <p className="mt-1 text-sm text-muted">One assignment. Move with purpose.</p>
        </div>
        <ModeToggle />
      </div>

      {strengthActive && strengthPlan && !showQuickActivity ? (
        <StrengthAssignment
          onQuickActivity={() => setShowQuickActivity(true)}
          plan={strengthPlan}
          progress={strengthProgress}
          onComplete={completeStrengthWorkout}
        />
      ) : (
        <ActivityAssignment
          profileMode={profile.mode}
          showBackToStrength={strengthActive}
          onBackToStrength={() => setShowQuickActivity(false)}
        />
      )}
    </div>
  );
}

// ---- Strength Journey assignment ------------------------------------------

function StrengthAssignment({
  plan,
  progress,
  onComplete,
  onQuickActivity,
}: {
  plan: StrengthPlan;
  progress: StrengthProgress;
  onComplete: () => void;
  onQuickActivity: () => void;
}) {
  const { leaveStrengthPlan } = useAppState();
  const finished = progress.current_week > plan.duration_weeks;
  const doneToday = progress.last_completed_date === todayKey();
  const workout = plan.workouts[progress.current_day - 1];

  const manageLinks = (
    <div className="mt-4 flex flex-col items-center gap-1 text-xs text-muted">
      <button onClick={onQuickActivity} className="font-semibold text-gold-soft hover:text-gold">
        Prefer a quick activity today?
      </button>
      <button onClick={leaveStrengthPlan} className="hover:text-foreground">
        Leave Strength Journey
      </button>
    </div>
  );

  if (finished) {
    return (
      <Card className="mt-5 border-evergreen/30 bg-evergreen/5 text-center">
        <CheckCircle2 size={28} className="mx-auto text-evergreen" />
        <h2 className="mt-3 font-serif text-2xl font-bold text-foreground">Journey Complete</h2>
        <p className="mt-1 text-muted">
          You finished {plan.title}. Well done staying faithful to the work.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link href="/plans" className="flex-1">
            <Button className="w-full">Start a New Journey</Button>
          </Link>
          <Button variant="outline" className="flex-1" onClick={leaveStrengthPlan}>
            Leave Plan
          </Button>
        </div>
      </Card>
    );
  }

  // Completed today — show rest state and a preview of what's next (not the
  // full next workout, so it doesn't read as already done).
  if (doneToday) {
    return (
      <>
        <Card className="mt-5 border-evergreen/30 bg-evergreen/5">
          <Badge tone="evergreen">
            <CheckCircle2 size={12} /> Today&apos;s Workout Complete
          </Badge>
          <h2 className="mt-3 font-serif text-2xl font-bold text-foreground">Well done.</h2>
          <p className="mt-1 text-muted">
            You showed up and put in the work. Rest, recover, and come back tomorrow.
          </p>
          <div className="mt-4 rounded-xl border border-border-subtle bg-surface-raised p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Next up · Week {progress.current_week} · Day {progress.current_day}
            </p>
            <p className="mt-1 font-serif text-lg font-semibold text-foreground">{workout.title}</p>
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
            <Dumbbell size={12} /> {plan.title}
          </Badge>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Week {progress.current_week} · Day {progress.current_day}
          </span>
        </div>

        <h2 className="mt-3 font-serif text-2xl font-bold text-foreground">{workout.title}</h2>
        <p className="mt-1 text-muted">{workout.purpose}</p>

        <div className="mt-4 rounded-xl border border-border-subtle bg-surface-raised p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Workout</p>
          <ul className="mt-2 flex flex-col gap-2">
            {workout.exercises.map((ex) => (
              <li key={ex.name} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-foreground">{ex.name}</span>
                <span className="shrink-0 text-muted">{ex.scheme}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-lg bg-gold/10 p-3 text-sm text-foreground">
          <Sparkles size={15} className="mt-0.5 shrink-0 text-gold-soft" />
          <span>
            <span className="font-semibold text-gold-soft">Faith Focus: </span>
            {workout.faith_focus}
          </span>
        </div>

        <AssignmentTimer
          key={`${progress.current_week}-${progress.current_day}`}
          kind="countup"
          durationSec={null}
          onFinish={onComplete}
        />
      </Card>

      {manageLinks}
    </>
  );
}

// ---- Regular activity assignment (walk / run / gym / recovery) ------------

function ActivityAssignment({
  profileMode,
  showBackToStrength,
  onBackToStrength,
}: {
  profileMode: "leisure" | "athlete";
  showBackToStrength: boolean;
  onBackToStrength: () => void;
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
      {showBackToStrength && (
        <button
          onClick={onBackToStrength}
          className="mt-4 flex items-center gap-1 text-sm font-semibold text-gold-soft hover:text-gold"
        >
          <ArrowLeft size={15} /> Back to your Strength Journey
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
