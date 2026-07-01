import Link from "next/link";
import { Heart } from "lucide-react";
import { Devotion } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface DevotionCardProps {
  devotion: Devotion;
  favorited?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function DevotionCard({ devotion, favorited, onToggleFavorite }: DevotionCardProps) {
  return (
    <Card className="flex flex-col gap-2 transition-colors hover:border-gold/40">
      <div className="flex items-start justify-between gap-2">
        <Badge tone="gold">{devotion.theme}</Badge>
        {onToggleFavorite && (
          <button
            aria-label="Toggle favorite"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(devotion.id);
            }}
            className={favorited ? "text-ember" : "text-muted hover:text-ember"}
          >
            <Heart size={18} fill={favorited ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <Link href={`/library/${devotion.id}`} className="block">
        <h3 className="font-serif text-lg font-semibold text-foreground">{devotion.title}</h3>
        <p className="mt-1 text-sm font-medium text-gold-soft">{devotion.scripture_reference}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{devotion.devotion_text}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {devotion.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-surface-raised px-2 py-0.5 text-[11px] font-medium text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      </Link>
    </Card>
  );
}
