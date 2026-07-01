"use client";

import { Flame } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";

export function StreakBadge() {
  const { profile, ready } = useAppState();
  const streak = ready ? profile.streak : 0;

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-raised px-3 py-1.5 text-sm font-semibold text-gold-soft">
      <Flame size={16} className="text-ember" />
      <span>{streak}</span>
      <span className="hidden text-xs font-medium text-muted sm:inline">
        day{streak === 1 ? "" : "s"}
      </span>
    </div>
  );
}
