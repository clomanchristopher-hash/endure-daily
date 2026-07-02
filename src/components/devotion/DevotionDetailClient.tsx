"use client";

import Link from "next/link";
import { ArrowLeft, Heart, NotebookPen } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ModeToggle } from "@/components/ui/ModeToggle";

export function DevotionDetailClient({ id }: { id: string }) {
  const { devotions, profile, isFavorite, toggleFavorite } = useAppState();
  const devotion = devotions.find((d) => d.id === id);

  if (!devotion) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-muted">This devotion could not be found.</p>
        <Link href="/library" className="mt-3 inline-block text-gold-soft">
          Back to Library
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(devotion.id);
  const challenge =
    profile.mode === "athlete" ? devotion.athlete_challenge : devotion.leisure_challenge;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
      <Link href="/library" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={15} /> Back to Library
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <Badge tone="gold">{devotion.theme}</Badge>
        <ModeToggle />
      </div>

      <h1 className="mt-3 font-serif text-2xl font-bold text-foreground">{devotion.title}</h1>

      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Scripture</p>
        <blockquote className="mt-2 border-l-2 border-gold pl-4 font-serif text-lg italic leading-relaxed text-foreground">
          &ldquo;{devotion.scripture_text}&rdquo;
        </blockquote>
        <p className="mt-2 text-sm font-semibold text-gold-soft">{devotion.scripture_reference}</p>
      </Card>

      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Devotion</p>
        <p className="mt-2 leading-relaxed text-foreground/90">{devotion.devotion_text}</p>
      </Card>

      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Prayer</p>
        <p className="mt-2 leading-relaxed text-foreground/90">{devotion.prayer}</p>
      </Card>

      <Card className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Reflection Question
        </p>
        <p className="mt-2 font-serif text-lg text-foreground">{devotion.reflection_question}</p>
      </Card>

      <Card className="mt-4 border-gold/30 bg-gold/5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-soft">
          {profile.mode === "athlete" ? "Active Challenge" : "Gentle Challenge"}
        </p>
        <p className="mt-2 leading-relaxed text-foreground">{challenge}</p>
      </Card>

      <div className="mt-5 flex gap-3">
        <Button
          variant={favorited ? "primary" : "outline"}
          className="flex-1"
          onClick={() => toggleFavorite(devotion.id)}
        >
          <Heart size={16} fill={favorited ? "currentColor" : "none"} />
          {favorited ? "Saved" : "Save to Favorites"}
        </Button>
        <Link href={`/journal?devotionId=${devotion.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            <NotebookPen size={16} />
            Journal This
          </Button>
        </Link>
      </div>
    </div>
  );
}
