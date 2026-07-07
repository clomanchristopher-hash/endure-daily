"use client";

import { useEffect, useState } from "react";
import { Clock, Sun, Cloud, Moon } from "lucide-react";
import { Card } from "@/components/ui/Card";

type RhythmTab = "morning" | "afternoon" | "evening";

const RHYTHM_DATA: Record<RhythmTab, { label: string; timeRange: string; icon: React.ComponentType<{ size: number; className?: string }>; content: string; description: string }> = {
  morning: {
    label: "Morning",
    timeRange: "5 AM – 12 PM",
    icon: Sun,
    content: "Scripture + Prayer",
    description: "Start your day rooted in the Word.",
  },
  afternoon: {
    label: "Afternoon",
    timeRange: "12 PM – 5 PM",
    icon: Cloud,
    content: "Devotion Check-In",
    description: "Pause and revisit today's mission.",
  },
  evening: {
    label: "Evening",
    timeRange: "5 PM – 9 PM",
    icon: Moon,
    content: "Reflection",
    description: "Look back and write how you lived it out.",
  },
};

function getCurrentTab(hour: number): RhythmTab {
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export function DailyRhythmCard() {
  const [time, setTime] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<RhythmTab>("morning");

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
      setSelectedTab(getCurrentTab(hour));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentData = RHYTHM_DATA[selectedTab];
  const CurrentIcon = currentData.icon;

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

      {/* Tab Navigation */}
      <div className="mt-4 flex gap-2">
        {(["morning", "afternoon", "evening"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold uppercase transition-colors ${
              selectedTab === tab
                ? "bg-gold text-[#0d1510]"
                : "border border-gold/30 bg-surface-raised text-foreground hover:border-gold/50 hover:bg-gold/10"
            }`}
          >
            {RHYTHM_DATA[tab].label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4 rounded-lg border border-gold/20 bg-surface-raised p-4">
        <div className="flex items-start gap-3">
          <CurrentIcon size={18} className="mt-0.5 shrink-0 text-gold" />
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-soft">
              {currentData.label} · {currentData.timeRange}
            </p>
            <p className="mt-1.5 font-serif text-lg font-bold text-foreground">{currentData.content}</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{currentData.description}</p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        A natural cadence. No deadlines—just guidance.
      </p>
    </Card>
  );
}
