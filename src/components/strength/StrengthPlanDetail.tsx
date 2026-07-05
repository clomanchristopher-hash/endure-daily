"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, Dumbbell, ShieldAlert } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { getStrengthPlanById } from "@/lib/data/strength";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function StrengthPlanDetail({ id }: { id: string }) {
  const router = useRouter();
  const { strengthProgress, startStrengthPlan, leaveStrengthPlan } = useAppState();
  const plan = getStrengthPlanById(id);

  if (!plan) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-muted">This strength journey could not be found.</p>
        <Link href="/plans" className="mt-3 inline-block text-gold-soft">
          Back to Plans
        </Link>
      </div>
    );
  }

  const isActive = strengthProgress.plan_id === plan.id;

  function handleStart() {
    startStrengthPlan(plan!.id);
    router.push("/fitness");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <Link
        href="/plans"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back to Plans
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <Badge tone={plan.lane === "challenge" ? "ember" : "evergreen"}>
          {plan.lane === "challenge" ? "Challenge" : "Foundation"}
        </Badge>
        {isActive && <Badge tone="gold">Active</Badge>}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Dumbbell size={22} className="text-gold-soft" />
        <h1 className="font-serif text-2xl font-bold text-foreground">{plan.title}</h1>
      </div>
      <p className="mt-2 leading-relaxed text-foreground/90">{plan.description}</p>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted">
        <CalendarDays size={16} />
        {plan.days_per_week} days per week · {plan.duration_weeks} weeks
      </div>

      {/* Start / manage */}
      <div className="mt-5 flex gap-3">
        {isActive ? (
          <>
            <Link href="/fitness" className="flex-1">
              <Button className="w-full">
                <Check size={16} /> Go to Today&apos;s Workout
              </Button>
            </Link>
            <Button variant="outline" className="flex-1" onClick={leaveStrengthPlan}>
              Leave Plan
            </Button>
          </>
        ) : (
          <Button className="flex-1" onClick={handleStart}>
            Start Plan
          </Button>
        )}
      </div>

      {/* Weekly schedule */}
      <h2 className="mt-8 font-serif text-lg font-semibold text-foreground">Weekly Schedule</h2>
      <p className="mt-1 text-sm text-muted">
        Repeat this week for all {plan.duration_weeks} weeks.
      </p>
      <div className="mt-3 flex flex-col gap-3">
        {plan.workouts.map((w) => (
          <Card key={w.day}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Day {w.day}
              </p>
            </div>
            <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">{w.title}</h3>
            <p className="mt-1 text-sm text-muted">{w.purpose}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {w.exercises.map((ex) => (
                <li key={ex.name} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground">{ex.name}</span>
                  <span className="shrink-0 text-muted">{ex.scheme}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-gold-soft">
              <span className="font-semibold">Faith Focus: </span>
              {w.faith_focus}
            </p>
          </Card>
        ))}
      </div>

      {/* Safety disclaimer */}
      <div className="mt-6 flex items-start gap-2 rounded-lg border border-border-subtle bg-surface p-4 text-xs text-muted">
        <ShieldAlert size={16} className="mt-0.5 shrink-0 text-muted" />
        <p>
          Move at your own pace. Modify exercises as needed and consult a qualified professional
          before beginning a new exercise program.
        </p>
      </div>
    </div>
  );
}
