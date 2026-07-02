"use client";

import { useEffect, useState } from "react";
import { Cross } from "lucide-react";

// Branded intro overlay. Shows every time the app first loads (no persistence).
// The forest background is opaque from the first paint so the Home screen never
// flashes underneath — a faint sprout and the text grow/fade in, hold ~1.7s,
// then the whole overlay fades out to reveal the app. Nothing to tap.
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
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background px-6 transition-opacity duration-500 ease-in-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Subtle sprout behind the words — growth, renewal, one day at a time. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {contentIn && <Sprout />}
      </div>

      <div
        className={`relative z-10 flex flex-col items-center text-center transition-opacity duration-700 ease-out ${
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

// Minimal seedling silhouette. Low opacity, earth tones, slow upward grow.
function Sprout() {
  return (
    <svg
      viewBox="0 0 200 230"
      className="h-[22rem] w-[22rem] origin-bottom opacity-[0.14] [animation:sproutRise_1600ms_ease-out_both] sm:h-[26rem] sm:w-[26rem]"
      fill="none"
      aria-hidden
    >
      {/* stem */}
      <path
        d="M100 214 C100 176 100 138 100 96"
        stroke="var(--sage)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* left leaf */}
      <path
        d="M100 132 C68 134 50 112 46 84 C76 86 96 104 100 132 Z"
        fill="var(--olive)"
      />
      {/* right leaf */}
      <path
        d="M100 116 C132 116 152 92 156 66 C126 68 104 88 100 116 Z"
        fill="var(--sage)"
      />
      {/* sprout tip */}
      <path
        d="M100 100 C95 84 100 70 105 62 C110 74 108 90 100 100 Z"
        fill="var(--accent)"
      />
      {/* soil line */}
      <path
        d="M58 214 H142"
        stroke="var(--olive)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
