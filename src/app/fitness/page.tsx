"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Dumbbell, Footprints, Sparkles } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { readJSON, todayKey, writeJSON } from "@/lib/storage";
import {
  ACTIVITY_STORAGE_KEY,
  activities,
  activitiesForLane,
  defaultActivityId,
} from "@/lib/data/activities";
import { getJourneyById } from "@/lib/data/journeys";
import { MovementJourney, JourneyProgress, UserMode } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AssignmentTimer } from "@/components/move/AssignmentTimer";
import { WorkoutDetails } from "@/components/journeys/WorkoutDetails";
import { MovementJourneys } from "@/components/journeys/MovementJourneys";

const ACTIVITY_KEY = ACTIVITY_STORAGE_KEY;
const COMPLETE_KEY = "assignment-complete-date";

type Tab = "foundation" | "challenge" | "journeys";
const TABS: Tab[] = ["foundation", "challenge", "journeys"];

export default function MovePage() {
  return (
    <Suspense fallback={null}>
      <MoveContent />
    </Suspense>
  );
}

function MoveContent() {
  const searchParams = useSearchParams();
  const { ready, profile, setMode, journeyProgress, completeJourneyDay } = useAppState();

  const journey = journeyProgress.plan_id ? getJourneyById(journeyProgress.plan_id) : undefined;
  // Only free previews carry a startable schedule.
  const activeJourney = journey && journey.days.length > 0 ? journey : undefined;

  const [tab, setTab] = useState<Tab>("foundation");
  const [journeyView, setJourneyView] = useState<"overview" | "assignment">("overview");
  const [initialized, setInitialized] = useState(false);

  // Choose the initial tab once state has loaded: honor ?tab / ?assignment,
  // otherwise open the active journey's assignment, otherwise the mode lane.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!ready || initialized) return;
    const tabParam = searchParams.get("tab");
    const assignmentParam = searchParams.get("assignment");
    if (tabParam === "journeys") {
      setTab("journeys");
      if (assignmentParam && activeJourney) setJourneyView("assignment");
    } else if (activeJourney) {
      setTab("journeys");
      setJourneyView("assignment");
    } else {
      setTab(profile.mode === "athlete" ? "challenge" : "foundation");
    }
    setInitialized(true);
  }, [ready, initialized, searchParams, activeJourney, profile.mode]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function selectTab(next: Tab) {
    setTab(next);
    // Foundation / Challenge double as the movement-lane (mode) selector.
    if (next === "foundation") setMode("leisure");
    else if (next === "challenge") setMode("athlete");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Move</h1>
        <p className="mt-1 text-sm text-muted">One assignment. Move with purpose.</p>
      </div>

      {/* Foundation | Challenge | Journeys */}
      <div className="mt-4 flex w-full rounded-full border border-border-subtle bg-surface-raised p-1 text-sm font-semibold">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => selectTab(t)}
            aria-pressed={tab === t}
            className={`flex-1 rounded-full px-2 py-1.5 capitalize transition-colors ${
              tab === t ? "bg-gold text-[#0d1510]" : "text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab !== "journeys" && (
        <p className="mt-2 text-xs text-muted">
          Choose Foundation for lighter movement or Challenge for higher-effort assignments.
        </p>
      )}

      {tab === "foundation" && (
        <ActivityAssignment key="foundation" lane="leisure" hasActiveJourney={Boolean(activeJourney)} />
      )}
      {tab === "challenge" && (
        <ActivityAssignment key="challenge" lane="athlete" hasActiveJourney={Boolean(activeJourney)} />
      )}
      {tab === "journeys" &&
        (activeJourney && journeyView === "assignment" ? (
          <JourneyAssignment
            journey={activeJourney}
            progress={journeyProgress}
            onComplete={completeJourneyDay}
            onBack={() => setJourneyView("overview")}
          />
        ) : (
          <JourneysOverview
            activeJourney={activeJourney}
            progress={journeyProgress}
            onViewAssignment={() => setJourneyView("assignment")}
          />
        ))}
    </div>
  );
}

// ---- Journeys overview: active card + full list ---------------------------

function JourneysOverview({
  activeJourney,
  progress,
  onViewAssignment,
}: {
  activeJourney: MovementJourney | undefined;
  progress: JourneyProgress;
  onViewAssignment: () => void;
}) {
  const { leaveJourney } = useAppState();

  return (
    <div className="mt-5">
      {activeJourney && (
        <ActiveJourneyCard
          journey={activeJourney}
          progress={progress}
          onView={onViewAssignment}
          onLeave={leaveJourney}
        />
      )}
      <div className={activeJourney ? "mt-7" : ""}>
        <MovementJourneys activeId={progress.plan_id} />
      </div>
    </div>
  );
}

function ActiveJourneyCard({
  journey,
  progress,
  onView,
  onLeave,
}: {
  journey: MovementJourney;
  progress: JourneyProgress;
  onView: () => void;
  onLeave: () => void;
}) {
  const CategoryIcon = journey.category === "running" ? Footprints : Dumbbell;
  const finished = progress.current_week > journey.duration_weeks;

  return (
    <Card className="border-gold/30 bg-gold/5">
      <div className="flex items-center justify-between">
        <Badge tone="gold">Active Journey</Badge>
        <button onClick={onLeave} className="text-xs text-muted hover:text-foreground">
          Leave
        </button>
      </div>
      <h3 className="mt-2 flex items-center gap-1.5 font-serif text-lg font-semibold text-foreground">
        <CategoryIcon size={16} className="text-gold-soft" /> {journey.title}
      </h3>
      <p className="mt-0.5 text-sm text-muted">
        Week {progress.current_week} · Day {progress.current_day}
      </p>
      <p className="mt-1 text-xs text-muted">
        {finished ? "Journey complete" : "Continue Today's Assignment"}
      </p>
      <Button className="mt-3 w-full" onClick={onView}>
        View Today&apos;s Assignment
      </Button>
    </Card>
  );
}

// ---- Movement Journey assignment (running or strength) --------------------

function JourneyAssignment({
  journey,
  progress,
  onComplete,
  onBack,
}: {
  journey: MovementJourney;
  progress: JourneyProgress;
  onComplete: () => void;
  onBack: () => void;
}) {
  const { leaveJourney } = useAppState();
  const finished = progress.current_week > journey.duration_weeks;
  const doneToday = progress.last_completed_date === todayKey();
  const day = journey.days[progress.current_day - 1];
  const CategoryIcon = journey.category === "running" ? Footprints : Dumbbell;

  const backLink = (
    <button
      onClick={onBack}
      className="mt-4 flex items-center gap-1 text-sm font-semibold text-gold-soft hover:text-gold"
    >
      <ArrowLeft size={15} /> Back to Journeys
    </button>
  );

  if (finished) {
    return (
      <>
        {backLink}
        <Card className="mt-5 border-evergreen/30 bg-evergreen/5 text-center">
          <CheckCircle2 size={28} className="mx-auto text-evergreen" />
          <h2 className="mt-3 font-serif text-2xl font-bold text-foreground">Journey Complete</h2>
          <p className="mt-1 text-muted">
            You finished {journey.title}. Well done staying faithful to the work.
          </p>
          <Button variant="outline" className="mt-4 w-full" onClick={leaveJourney}>
            Leave Plan
          </Button>
        </Card>
      </>
    );
  }

  if (doneToday) {
    return (
      <>
        {backLink}
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
      </>
    );
  }

  return (
    <>
      {backLink}
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
    </>
  );
}

// ---- Foundation / Challenge daily activity assignment ---------------------

function ActivityAssignment({
  lane,
  hasActiveJourney,
}: {
  lane: UserMode;
  hasActiveJourney: boolean;
}) {
  const { dailyProgress, toggleDailyProgress } = useAppState();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  // Foundation and Challenge each remember their own activity, so switching
  // lanes shows the right default (walk vs run) instead of one shared choice.
  const laneKey = `${ACTIVITY_KEY}-${lane}`;

  const laneName = lane === "athlete" ? "challenge" : "foundation";

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const savedId = readJSON<string | null>(laneKey, null);
    // Only honor a saved activity that belongs to this lane.
    const valid = savedId && activities[savedId]?.lane === laneName;
    setSelectedId(valid ? savedId : null);
    setCompleted(readJSON<string | null>(COMPLETE_KEY, null) === todayKey());
  }, [laneKey, laneName]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const activity = activities[selectedId ?? defaultActivityId(lane)];

  function selectActivity(id: string) {
    setSelectedId(id);
    writeJSON(laneKey, id);
  }

  function handleFinish() {
    writeJSON(COMPLETE_KEY, todayKey());
    setCompleted(true);
    if (!dailyProgress.workout) toggleDailyProgress("workout");
  }

  return (
    <>
      {hasActiveJourney && (
        <p className="mt-4 rounded-lg border border-border-subtle bg-surface-raised px-3 py-2.5 text-xs text-muted">
          Active Journey assignment is currently guiding today&apos;s movement.
        </p>
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
        {activitiesForLane(lane).map((id) => {
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
