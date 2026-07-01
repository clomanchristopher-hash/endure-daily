import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Plan } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const categoryTone = {
  leisure: "evergreen",
  athlete: "ember",
  both: "gold",
} as const;

interface PlanCardProps {
  plan: Plan;
  progress: number;
  active: boolean;
}

export function PlanCard({ plan, progress, active }: PlanCardProps) {
  const pct = Math.min(100, Math.round((progress / plan.duration_days) * 100));
  return (
    <Link href={`/plans/${plan.id}`}>
      <Card className="flex h-full flex-col gap-2 transition-colors hover:border-gold/40">
        <div className="flex items-center justify-between">
          <Badge tone={categoryTone[plan.category]}>{plan.category}</Badge>
          {active && <Badge tone="gold">Active</Badge>}
        </div>
        <h3 className="font-serif text-lg font-semibold text-foreground">{plan.title}</h3>
        <p className="text-sm font-medium text-gold-soft">{plan.subtitle}</p>
        <p className="line-clamp-2 text-sm text-muted">{plan.description}</p>
        <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted">
          <CalendarDays size={14} />
          {plan.duration_days} days
        </div>
        {progress > 0 && (
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
            <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
          </div>
        )}
      </Card>
    </Link>
  );
}
