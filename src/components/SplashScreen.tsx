"use client";

import { useEffect, useState } from "react";
import { Cross } from "lucide-react";

// Branded intro overlay. Shows every time the app first loads (no persistence).
// The navy background is opaque from the first paint so the Home screen never
// flashes underneath — the text fades in, holds ~1.7s, then the whole overlay
// fades out to reveal the app. Nothing to tap.
export function SplashScreen() {
  const [contentIn, setContentIn] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fadeInText = setTimeout(() => setContentIn(true), 50);
    const startExit = setTimeout(() => setLeaving(true), 1700);
    const unmount = setTimeout(() => setDone(true), 2250);
    return () => {
      clearTimeout(fadeInText);
      clearTimeout(startExit);
      clearTimeout(unmount);
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background px-6 transition-opacity duration-500 ease-in-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`flex flex-col items-center text-center transition-opacity duration-700 ease-out ${
          contentIn ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
          <Cross size={30} strokeWidth={2.25} />
        </span>

        <h1 className="font-serif text-2xl font-medium tracking-wide text-gold-soft">
          Endure Daily
        </h1>

        <div className="mt-8 space-y-1">
          <p className="font-serif text-[1.75rem] font-bold leading-snug text-foreground sm:text-4xl">
            Grow in Faith.
          </p>
          <p className="font-serif text-[1.75rem] font-bold leading-snug text-foreground sm:text-4xl">
            Move with Purpose.
          </p>
          <p className="font-serif text-[1.75rem] font-bold leading-snug text-foreground sm:text-4xl">
            Live with Discipline.
          </p>
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          One day at a time.
        </p>
      </div>
    </div>
  );
}
