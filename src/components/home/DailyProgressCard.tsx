"use client";

import { Check } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { DAILY_PROGRESS_ITEMS } from "@/types";
import { Card } from "@/components/ui/Card";

export function DailyProgressCard() {
  const { dailyProgress, toggleDailyProgress } = useAppState();
  const completed = DAILY_PROGRESS_ITEMS.filter((i) => dailyProgress[i.key]).length;
  const total = DAILY_PROGRESS_ITEMS.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <Card className="mt-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Today&apos;s Progress
        </p>
        <span className="text-sm font-semibold text-gold-soft">
          {completed} / {total} Complete
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-raised">
        <div
          className="h-full rounded-full bg-gold transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {DAILY_PROGRESS_ITEMS.map((item) => {
          const done = dailyProgress[item.key];
          return (
            <button
              key={item.key}
              onClick={() => toggleDailyProgress(item.key)}
              aria-pressed={done}
              className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-raised px-3 py-2.5 text-left transition-colors hover:border-gold/40"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  done ? "border-gold bg-gold text-[#0d1510]" : "border-border-subtle"
                }`}
              >
                {done && <Check size={14} strokeWidth={3} />}
              </span>
              <span
                className={`text-sm font-medium transition-colors ${
                  done ? "text-muted line-through" : "text-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
