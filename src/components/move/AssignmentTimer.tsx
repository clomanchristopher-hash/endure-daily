"use client";

import { useEffect, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";

function formatTime(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Shared timer used by both the activity assignment and Strength Journeys.
// countdown for timed activities; countup (durationSec null) for open-ended
// work like gym sessions and strength workouts. Reset by changing `key`.
export function AssignmentTimer({
  kind,
  durationSec,
  onFinish,
}: {
  kind: "countdown" | "countup";
  durationSec: number | null;
  onFinish: () => void;
}) {
  const isCountdown = kind === "countdown";
  const initial = isCountdown ? durationSec ?? 0 : 0;
  const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
  const [seconds, setSeconds] = useState(initial);

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
