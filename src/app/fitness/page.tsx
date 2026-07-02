"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Pause, Play, Sparkles, Square } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { readJSON, todayKey, writeJSON } from "@/lib/storage";
import { Activity, activities, activityOrder, defaultActivityId } from "@/lib/data/activities";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ModeToggle } from "@/components/ui/ModeToggle";

const ACTIVITY_KEY = "assignment-activity";
const COMPLETE_KEY = "assignment-complete-date";

function formatTime(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function FitnessPage() {
  const { profile, dailyProgress, toggleDailyProgress } = useAppState();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  // localStorage is client-only, so load any explicit choice + completion here.
  // We only store an id when the user actively picks one; otherwise selectedId
  // stays null and the assignment follows their mode (leisure -> walk, etc.).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const savedId = readJSON<string | null>(ACTIVITY_KEY, null);
    if (savedId && activities[savedId]) setSelectedId(savedId);
    setCompleted(readJSON<string | null>(COMPLETE_KEY, null) === todayKey());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const activity = activities[selectedId ?? defaultActivityId(profile.mode)];

  function selectActivity(id: string) {
    setSelectedId(id);
    writeJSON(ACTIVITY_KEY, id);
  }

  function handleFinish() {
    writeJSON(COMPLETE_KEY, todayKey());
    setCompleted(true);
    // Connect to Today's Progress — mark the Workout item done if it isn't.
    if (!dailyProgress.workout) toggleDailyProgress("workout");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Fitness</h1>
          <p className="mt-1 text-sm text-muted">One assignment. Move with purpose.</p>
        </div>
        <ModeToggle />
      </div>

      {/* Today's Assignment — the single featured card */}
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

        <AssignmentTimer key={activity.id} activity={activity} onFinish={handleFinish} />
      </Card>

      {/* More Activities — compact chips, not dominating the screen */}
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
    </div>
  );
}

function AssignmentTimer({
  activity,
  onFinish,
}: {
  activity: Activity;
  onFinish: () => void;
}) {
  const isCountdown = activity.kind === "countdown";
  const initial = isCountdown ? activity.durationSec ?? 0 : 0;
  const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
  const [seconds, setSeconds] = useState(initial);

  // Tick once per second while running. The interval lives with the effect so
  // it's always cleaned up on pause, unmount, or activity switch.
  useEffect(() => {
    if (status !== "running") return;
    const id = window.setInterval(() => {
      setSeconds((prev) => (isCountdown ? Math.max(prev - 1, 0) : prev + 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [status, isCountdown]);

  // A countdown that hits zero stops ticking; Finish stays available.
  useEffect(() => {
    if (isCountdown && status === "running" && seconds === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("paused");
    }
  }, [seconds, status, isCountdown]);

  function finish() {
    setStatus("idle");
    setSeconds(initial);
    onFinish();
  }

  return (
    <div className="mt-5">
      <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-surface-raised py-6">
        <span className="font-serif text-5xl font-bold tabular-nums text-foreground">
          {formatTime(seconds)}
        </span>
        <span className="mt-1 text-xs uppercase tracking-wider text-muted">
          {isCountdown ? "Time remaining" : "Time elapsed"}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        {status === "idle" && (
          <Button className="flex-1" onClick={() => setStatus("running")}>
            <Play size={16} /> Start Timer
          </Button>
        )}
        {status === "running" && (
          <>
            <Button variant="secondary" className="flex-1" onClick={() => setStatus("paused")}>
              <Pause size={16} /> Pause
            </Button>
            <Button className="flex-1" onClick={finish}>
              <Square size={15} /> Finish
            </Button>
          </>
        )}
        {status === "paused" && (
          <>
            <Button className="flex-1" onClick={() => setStatus("running")}>
              <Play size={16} /> Resume
            </Button>
            <Button variant="secondary" className="flex-1" onClick={finish}>
              <Square size={15} /> Finish
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
