import { Lock, LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { Badge } from "./Badge";

interface PremiumLockCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function PremiumLockCard({ icon: Icon, title, description }: PremiumLockCardProps) {
  return (
    <Card className="relative overflow-hidden border-dashed opacity-90">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-raised text-gold-soft">
          <Icon size={20} />
        </span>
        <Badge tone="gold">Coming Soon</Badge>
      </div>
      <h3 className="mt-3 font-serif text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-muted">
        <Lock size={13} />
        Premium feature — in development
      </div>
    </Card>
  );
}
