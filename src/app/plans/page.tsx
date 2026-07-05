"use client";

import Link from "next/link";
import { CalendarDays, Dumbbell } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { plans } from "@/lib/data/plans";
import { strengthPlans } from "@/lib/data/strength";
import { PlanCard } from "@/components/plans/PlanCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function PlansPage() {
  const { profile, strengthProgress } = useAppState();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
      <h1 className="font-serif text-2xl font-bold text-foreground">Plans</h1>
      <p className="mt-1 text-sm text-muted">
        Multi-day devotion journeys to build momentum in your faith and fitness.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            progress={profile.plan_progress[plan.id] ?? 0}
            active={profile.active_plan_id === plan.id}
          />
        ))}
      </div>

      {/* Strength Journeys */}
      <div className="mt-10">
        <h2 className="font-serif text-xl font-bold text-foreground">Strength Journeys</h2>
        <p className="mt-1 text-sm text-muted">
          Build strength with purpose, one day at a time.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {strengthPlans.map((plan) => {
            const active = strengthProgress.plan_id === plan.id;
            return (
              <Link key={plan.id} href={`/strength/${plan.id}`}>
                <Card className="flex h-full flex-col gap-2 transition-colors hover:border-gold/40">
                  <div className="flex items-center justify-between">
                    <Badge tone={plan.lane === "challenge" ? "ember" : "evergreen"}>
                      {plan.lane === "challenge" ? "Challenge" : "Foundation"}
                    </Badge>
                    {active && <Badge tone="gold">Active</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Dumbbell size={18} className="text-gold-soft" />
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {plan.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted">{plan.description}</p>
                  <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted">
                    <CalendarDays size={14} />
                    {plan.days_per_week} days per week · {plan.duration_weeks} weeks
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
