"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Cross, Leaf } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { DailyRhythm, UserMode } from "@/types";
import { activityOrder, activities } from "@/lib/data/activities";
import { Button } from "@/components/ui/Button";

const FOCUS_OPTIONS = [
  "Grow closer to God",
  "Build discipline",
  "Improve health",
  "Walk more",
  "Run more",
  "Build strength",
  "Stay consistent",
];

const RHYTHM_OPTIONS: { value: DailyRhythm; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "custom", label: "Custom time" },
];

const LANES: { value: UserMode; label: string; description: string }[] = [
  {
    value: "leisure",
    label: "Foundation",
    description: "Build consistency with walking, recovery, and beginner-friendly movement.",
  },
  {
    value: "athlete",
    label: "Challenge",
    description: "Push yourself with running, gym workouts, and higher-effort movement.",
  },
];

const TOTAL_STEPS = 7;

export function OnboardingFlow() {
  const router = useRouter();
  const { ready, onboarding, completeOnboarding } = useAppState();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [focuses, setFocuses] = useState<string[]>([]);
  const [lane, setLane] = useState<UserMode | null>(null);
  const [activity, setActivity] = useState<string | null>(null);
  const [rhythm, setRhythm] = useState<DailyRhythm | null>(null);
  const [customTime, setCustomTime] = useState("07:00");

  if (!ready || onboarding.completed) return null;

  const canContinue =
    (step === 1 && name.trim().length === 0) ||
    (step === 3 && lane === null) ||
    (step === 4 && activity === null) ||
    (step === 5 && rhythm === null)
      ? false
      : true;

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function toggleFocus(f: string) {
    setFocuses((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  }
  function finish() {
    completeOnboarding({
      name: name.trim() || "Friend",
      mode: lane ?? "leisure",
      activity: activity ?? "walk",
      focuses,
      rhythm,
      customTime: rhythm === "custom" ? customTime : null,
    });
    router.push("/");
  }

  return (
    <div className="fixed inset-0 z-[95] overflow-y-auto bg-background">
      <div className="mx-auto flex min-h-full max-w-md flex-col px-6 py-8">
        {/* Header: back + progress dots */}
        <div className="flex items-center justify-between">
          {step > 0 && step < TOTAL_STEPS - 1 ? (
            <button
              onClick={back}
              className="flex items-center gap-1 text-sm text-muted hover:text-foreground"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-5 bg-gold" : i < step ? "w-1.5 bg-gold/50" : "w-1.5 bg-surface-raised"
                }`}
              />
            ))}
          </div>
          <span />
        </div>

        <div className="flex flex-1 flex-col justify-center py-8">
          {step === 0 && (
            <div className="text-center">
              <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                <Cross size={28} strokeWidth={2.25} />
              </span>
              <h1 className="font-serif text-3xl font-bold text-foreground">
                Welcome to Endure Daily
              </h1>
              <p className="mt-3 font-serif text-lg text-gold-soft">
                Grow in Faith. Move with Purpose. Live with Discipline.
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <StepTitle>What should we call you?</StepTitle>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-4 w-full rounded-lg border border-border-subtle bg-surface-raised px-4 py-3 text-base text-foreground outline-none placeholder:text-muted focus:border-gold/50"
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <StepTitle>What are you focusing on right now?</StepTitle>
              <p className="mt-1 text-sm text-muted">Choose any that apply.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {FOCUS_OPTIONS.map((f) => (
                  <Chip key={f} active={focuses.includes(f)} onClick={() => toggleFocus(f)}>
                    {f}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <StepTitle>Choose your movement lane.</StepTitle>
              <div className="mt-4 flex flex-col gap-3">
                {LANES.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLane(l.value)}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      lane === l.value
                        ? "border-gold bg-gold/10"
                        : "border-border-subtle bg-surface hover:border-gold/40"
                    }`}
                  >
                    <p className="font-serif text-lg font-semibold text-foreground">{l.label}</p>
                    <p className="mt-1 text-sm text-muted">{l.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <StepTitle>How do you want to move most often?</StepTitle>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {activityOrder.map((id) => (
                  <Chip key={id} active={activity === id} onClick={() => setActivity(id)}>
                    {activities[id].label}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <StepTitle>When would you like to be reminded?</StepTitle>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {RHYTHM_OPTIONS.map((r) => (
                  <Chip key={r.value} active={rhythm === r.value} onClick={() => setRhythm(r.value)}>
                    {r.label}
                  </Chip>
                ))}
              </div>
              {rhythm === "custom" && (
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="mt-3 w-full rounded-lg border border-border-subtle bg-surface-raised px-4 py-3 text-base text-foreground outline-none focus:border-gold/50"
                />
              )}
              <p className="mt-3 text-xs text-muted">
                Saved for now — gentle reminders are coming in a future update.
              </p>
            </div>
          )}

          {step === 6 && (
            <div className="text-center">
              <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-evergreen/15 text-evergreen">
                <Leaf size={28} strokeWidth={2.25} />
              </span>
              <h1 className="font-serif text-3xl font-bold text-foreground">
                Your journey is set.
              </h1>
              <p className="mt-3 font-serif text-lg text-gold-soft">
                One faithful step at a time.
              </p>
            </div>
          )}
        </div>

        {/* Footer button */}
        <div>
          {step === 0 && (
            <Button className="w-full" onClick={next}>
              Begin Your Journey
            </Button>
          )}
          {step > 0 && step < TOTAL_STEPS - 1 && (
            <Button className="w-full" onClick={next} disabled={!canContinue}>
              Continue
            </Button>
          )}
          {step === TOTAL_STEPS - 1 && (
            <Button className="w-full" onClick={finish}>
              Start Today&apos;s Journey
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-2xl font-bold text-foreground">{children}</h2>;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? "border-transparent bg-gold text-[#0d1510]"
          : "border-border-subtle bg-surface text-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
