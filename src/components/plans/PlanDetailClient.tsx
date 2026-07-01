"use client";

import Link from "next/link";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { getPlanById } from "@/lib/data/plans";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function PlanDetailClient({ id }: { id: string }) {
  const { profile, devotions, setActivePlan, markPlanDayComplete } = useAppState();
  const plan = getPlanById(id);

  if (!plan) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-muted">This plan could not be found.</p>
        <Link href="/plans" className="mt-3 inline-block text-gold-soft">
          Back to Plans
        </Link>
      </div>
    );
  }

  const progress = profile.plan_progress[plan.id] ?? 0;
  const isActive = profile.active_plan_id === plan.id;
  const pct = Math.min(100, Math.round((progress / plan.duration_days) * 100));

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <Link href="/plans" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={15} /> Back to Plans
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <Badge tone="gold">{plan.category}</Badge>
        {plan.premium && (
          <Badge tone="muted">
            <Lock size={11} /> Premium
          </Badge>
        )}
      </div>

      <h1 className="mt-3 font-serif text-2xl font-bold text-foreground">{plan.title}</h1>
      <p className="mt-1 text-sm font-medium text-gold-soft">{plan.subtitle}</p>
      <p className="mt-3 leading-relaxed text-foreground/90">{plan.description}</p>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-raised">
        <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-muted">
        {progress} of {plan.duration_days} days complete
      </p>

      <div className="mt-4 flex gap-3">
        {isActive ? (
          <Button
            variant="primary"
            className="flex-1"
            disabled={progress >= plan.duration_days}
            onClick={() => markPlanDayComplete(plan.id)}
          >
            <Check size={16} />
            {progress >= plan.duration_days ? "Plan Complete" : "Mark Today Complete"}
          </Button>
        ) : (
          <Button variant="primary" className="flex-1" onClick={() => setActivePlan(plan.id)}>
            Start This Plan
          </Button>
        )}
      </div>

      <h2 className="mt-8 font-serif text-lg font-semibold text-foreground">Daily Devotions</h2>
      <div className="mt-3 flex flex-col gap-2">
        {plan.devotion_ids.map((devId, i) => {
          const devotion = devotions.find((d) => d.id === devId);
          const done = i < progress;
          return (
            <Link key={`${devId}-${i}`} href={devotion ? `/library/${devotion.id}` : "#"}>
              <Card
                className={`flex items-center gap-3 py-3 ${done ? "border-evergreen/40" : ""}`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done ? "bg-evergreen/20 text-evergreen" : "bg-surface-raised text-muted"
                  }`}
                >
                  {done ? <Check size={14} /> : i + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-serif text-sm font-semibold text-foreground">
                    Day {i + 1}: {devotion?.title ?? "Devotion"}
                  </p>
                  <p className="truncate text-xs text-muted">{devotion?.theme}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
