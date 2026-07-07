"use client";

import { useEffect, useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Button } from "@/components/ui/Button";

// Shown once per day when all Today's Progress items are complete.
// Renders globally (see layout) so it can appear immediately even if the last
// item is completed from the Move tab, or on return to Today.
export function CompletionCelebration() {
  const { ready, allProgressComplete, celebrationSeenToday, markCelebrationSeen } = useAppState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (ready && allProgressComplete && !celebrationSeenToday) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      // Persist immediately so a reload (or re-check) won't reopen it today.
      markCelebrationSeen();
    }
  }, [ready, allProgressComplete, celebrationSeenToday, markCelebrationSeen]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Journey complete"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-background/85 px-6 backdrop-blur-sm [animation:celebrateIn_300ms_ease-out]"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border-subtle bg-surface p-8 text-center [animation:celebrateIn_450ms_ease-out]">
        <Particles />

        {/* Checkmark with a soft glow behind it */}
        <div className="relative mx-auto mb-5 h-20 w-20">
          <div className="absolute inset-0 -z-0 rounded-full bg-accent/25 blur-2xl [animation:glowPulse_2.4s_ease-in-out_infinite]" />
          <svg viewBox="0 0 80 80" className="relative h-20 w-20 [animation:checkPop_500ms_ease-out_both]">
            <circle cx="40" cy="40" r="36" fill="none" stroke="var(--sage)" strokeWidth="3" opacity="0.5" />
            <path
              d="M25 41 L36 52 L56 30"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 48,
                strokeDashoffset: 48,
                animation: "checkDraw 500ms ease-out 300ms forwards",
              }}
            />
          </svg>
        </div>

        <h2 className="relative font-serif text-2xl font-bold text-foreground">Journey Complete</h2>
        <p className="relative mt-1 text-sm text-muted">You showed up today.</p>

        <div className="relative mt-5 space-y-0.5">
          <p className="font-serif text-lg font-bold text-foreground">Grow in Faith.</p>
          <p className="font-serif text-lg font-bold text-foreground">Move with Purpose.</p>
          <p className="font-serif text-lg font-bold text-foreground">Live with Discipline.</p>
        </div>

        <p className="relative mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          One day at a time.
        </p>

        <Button className="relative mt-6 w-full" onClick={() => setVisible(false)}>
          Continue
        </Button>
      </div>
    </div>
  );
}

// A few faint leaves drifting upward — ambient, not confetti.
const PARTICLES = [
  { left: "12%", delay: "0s", size: 10 },
  { left: "28%", delay: "1.1s", size: 7 },
  { left: "50%", delay: "0.5s", size: 9 },
  { left: "72%", delay: "1.6s", size: 7 },
  { left: "86%", delay: "0.8s", size: 10 },
];

function Particles() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute top-16"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animation: `leafDrift 4s ease-in-out ${p.delay} infinite`,
          }}
          aria-hidden
        >
          <path d="M12 2 C18 6 18 16 12 22 C6 16 6 6 12 2 Z" fill="var(--sage)" />
        </svg>
      ))}
    </div>
  );
}
