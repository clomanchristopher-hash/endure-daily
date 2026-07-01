"use client";

import { useAppState } from "@/context/AppStateContext";
import { plans } from "@/lib/data/plans";
import { PlanCard } from "@/components/plans/PlanCard";

export default function PlansPage() {
  const { profile } = useAppState();

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
    </div>
  );
}
