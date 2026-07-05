"use client";

import Link from "next/link";
import { ArrowRight, Footprints } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { plans } from "@/lib/data/plans";
import { PlanCard } from "@/components/plans/PlanCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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

      {/* Movement Journeys now live in the Move tab */}
      <Card className="mt-8 flex flex-col gap-4 border-gold/30 bg-gold/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold-soft">
            <Footprints size={20} />
          </span>
          <div>
            <p className="font-serif text-base font-semibold text-foreground">
              Movement Journeys now live in the Move tab.
            </p>
            <p className="mt-1 text-sm text-muted">
              Running and strength journeys are part of your daily Move experience.
            </p>
          </div>
        </div>
        <Link href="/fitness?tab=journeys" className="shrink-0">
          <Button className="w-full sm:w-auto">
            Go to Move <ArrowRight size={15} />
          </Button>
        </Link>
      </Card>
    </div>
  );
}
