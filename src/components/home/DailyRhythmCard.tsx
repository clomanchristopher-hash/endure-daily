"use client";

import { useEffect, useState } from "react";
import { Clock, Sun, Cloud, Moon } from "lucide-react";
import { Card } from "@/components/ui/Card";

const RHYTHM_TIMES = {
  morning: { start: 5, end: 12, label: "Morning", icon: Sun, activity: "Scripture & Prayer" },
  afternoon: { start: 12, end: 17, label: "Afternoon", icon: Cloud, activity: "Devotion & Reflection" },
  evening: { start: 17, end: 21, label: "Evening", icon: Moon, activity: "Reflection & Planning" },
};

type RhythmPeriod = keyof typeof RHYTHM_TIMES;

function getCurrentPeriod(hour: number): RhythmPeriod {
  if (hour >= RHYTHM_TIMES.morning.start && hour < RHYTHM_TIMES.morning.end) return "morning";
  if (hour >= RHYTHM_TIMES.afternoon.start && hour < RHYTHM_TIMES.afternoon.end) return "afternoon";
  if (hour >= RHYTHM_TIMES.evening.start && hour < RHYTHM_TIMES.evening.end) return "evening";
  return "morning"; // default to morning for early morning/night
}

function getNextPeriod(hour: number): RhythmPeriod {
  const current = getCurrentPeriod(hour);
  if (current === "morning") return "afternoon";
  if (current === "afternoon") return "evening";
  return "morning";
}

export function DailyRhythmCard() {
  const [time, setTime] = useState<string>("");
  const [period, setPeriod] = useState<RhythmPeriod>("morning");
  const [nextPeriod, setNextPeriod] = useState<RhythmPeriod>("afternoon");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const formatted = now.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setTime(formatted);
      setPeriod(getCurrentPeriod(hour));
      setNextPeriod(getNextPeriod(hour));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const current = RHYTHM_TIMES[period];
  const next = RHYTHM_TIMES[nextPeriod];
  const CurrentIcon = current.icon;
  const NextIcon = next.icon;

  return (
    <Card className="mt-4 border-gold/30 bg-gold/5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-soft">
          <Clock size={13} /> Daily Rhythm
        </p>
        <span className="rounded-full bg-surface-raised px-2.5 py-1 text-xs font-semibold text-foreground">
          {time || "—"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Current Period */}
        <div className="rounded-lg border border-gold/30 bg-surface-raised p-3">
          <div className="flex items-center gap-2">
            <CurrentIcon size={16} className="text-gold" />
            <p className="text-xs font-semibold uppercase text-gold-soft">{current.label}</p>
          </div>
          <p className="mt-1.5 text-sm font-medium text-foreground">{current.activity}</p>
        </div>

        {/* Next Period */}
        <div className="rounded-lg border border-border-subtle bg-surface-raised p-3">
          <div className="flex items-center gap-2">
            <NextIcon size={16} className="text-muted" />
            <p className="text-xs font-semibold uppercase text-muted">Next: {next.label}</p>
          </div>
          <p className="mt-1.5 text-sm font-medium text-foreground/70">{next.activity}</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        A natural cadence to help you stay connected throughout the day. No deadlines, just gentle guidance.
      </p>
    </Card>
  );
}
