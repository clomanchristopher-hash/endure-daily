import Link from "next/link";
import { CalendarDays, Lock } from "lucide-react";
import { MovementJourney } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function metaLine(journey: MovementJourney): string {
  const weeks = `${journey.duration_weeks} ${journey.duration_weeks === 1 ? "Week" : "Weeks"}`;
  const level = journey.level === "challenge" ? "Challenge" : "Foundation";
  return [journey.distance, weeks, level].filter(Boolean).join(" · ");
}

export function JourneyCard({
  journey,
  active,
  onLockedClick,
}: {
  journey: MovementJourney;
  active: boolean;
  onLockedClick: () => void;
}) {
  const free = journey.access === "free";

  const inner = (
    <Card
      className={`flex h-full flex-col gap-2 transition-colors ${
        free ? "hover:border-gold/40" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <Badge tone={free ? "evergreen" : "muted"}>{free ? "Free Preview" : "Premium"}</Badge>
        {active ? (
          <Badge tone="gold">Active</Badge>
        ) : (
          !free && <Lock size={15} className="text-muted" />
        )}
      </div>
      <h4 className="font-serif text-lg font-semibold text-foreground">{journey.title}</h4>
      <div className="flex items-center gap-1.5 text-xs text-muted">
        <CalendarDays size={13} />
        {metaLine(journey)}
      </div>
      <p className="text-sm text-muted">{journey.description}</p>
      <p
        className={`mt-auto pt-2 text-xs font-semibold ${
          free ? "text-gold-soft" : "text-muted"
        }`}
      >
        {free ? "Start Plan →" : "Coming Soon"}
      </p>
    </Card>
  );

  if (free) {
    return <Link href={`/journeys/${journey.id}`}>{inner}</Link>;
  }
  return (
    <button onClick={onLockedClick} className="w-full text-left" aria-label={`${journey.title} — Premium, coming soon`}>
      {inner}
    </button>
  );
}
