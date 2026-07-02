"use client";

import { useAppState } from "@/context/AppStateContext";

export function ModeToggle({ className = "" }: { className?: string }) {
  const { profile, setMode } = useAppState();

  return (
    <div
      className={`inline-flex rounded-full border border-border-subtle bg-surface-raised p-1 text-sm font-semibold ${className}`}
    >
      <button
        onClick={() => setMode("leisure")}
        className={`rounded-full px-4 py-1.5 transition-colors ${
          profile.mode === "leisure" ? "bg-gold text-[#0d1510]" : "text-muted"
        }`}
      >
        Gentle
      </button>
      <button
        onClick={() => setMode("athlete")}
        className={`rounded-full px-4 py-1.5 transition-colors ${
          profile.mode === "athlete" ? "bg-gold text-[#0d1510]" : "text-muted"
        }`}
      >
        Active
      </button>
    </div>
  );
}
